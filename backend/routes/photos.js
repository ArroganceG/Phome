const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../utils/db');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

router.get('/', async (req, res) => {
  try {
    await db.initDb();
    const photos = await db.getPhotos();
    const baseUrl = process.env.API_BASE_URL || `http://localhost:3001`;
    const photosWithFullUrl = photos.map(photo => ({
      ...photo,
      src: photo.src && photo.src.startsWith('/uploads/')
        ? `${baseUrl}${photo.src}`
        : photo.src
    }));
    res.json(photosWithFullUrl);
  } catch (error) {
    console.error('Error getting photos:', error);
    res.status(500).json({ error: 'Failed to get photos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await db.initDb();
    const photo = await db.getPhotoById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    const baseUrl = process.env.API_BASE_URL || `http://localhost:3001`;
    photo.src = photo.src && photo.src.startsWith('/uploads/')
      ? `${baseUrl}${photo.src}`
      : photo.src;
    res.json(photo);
  } catch (error) {
    console.error('Error getting photo:', error);
    res.status(500).json({ error: 'Failed to get photo' });
  }
});

router.post('/', async (req, res) => {
  try {
    await db.initDb();
    const { title, description, category, imageBase64 } = req.body;

    let imageUrl = '';

    if (imageBase64) {
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const ext = imageBase64.match(/^data:image\/(\w+);base64,/);
        const extension = ext ? ext[1] : 'jpg';
        const fileName = `${uuidv4()}.${extension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        imageUrl = `/uploads/${fileName}`;
      } catch (err) {
        console.error('Error saving image:', err);
        return res.status(500).json({ error: 'Failed to save image' });
      }
    }

    const photoTitle = title || '未命名';
    const existingPhoto = await db.getPhotoByTitle(photoTitle);
    if (existingPhoto) {
      return res.status(409).json({
        error: 'duplicate',
        message: `照片"${photoTitle}"已存在`,
        existingPhoto: {
          id: existingPhoto.id,
          title: existingPhoto.title,
          category: existingPhoto.category,
          src: `${process.env.API_BASE_URL || 'http://localhost:3001'}${existingPhoto.src}`
        }
      });
    }

    const newPhoto = {
      id: uuidv4(),
      title: photoTitle,
      description: description || '',
      category: category || '未分类',
      src: imageUrl,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    await db.createPhoto(newPhoto);

    const baseUrl = process.env.API_BASE_URL || `http://localhost:3001`;
    newPhoto.src = `${baseUrl}${imageUrl}`;

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await db.initDb();
    const photo = await db.getPhotoById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const { title, description, category } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;

    const updated = await db.updatePhoto(req.params.id, updates);

    const baseUrl = process.env.API_BASE_URL || `http://localhost:3001`;
    updated.src = updated.src && updated.src.startsWith('/uploads/')
      ? `${baseUrl}${updated.src}`
      : updated.src;

    res.json(updated);
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.initDb();
    const photo = await db.getPhotoById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.src && photo.src.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', photo.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.deletePhoto(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

router.post('/batch-delete', async (req, res) => {
  try {
    await db.initDb();
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid ids array' });
    }

    const deletedIds = [];
    for (const id of ids) {
      const photo = await db.getPhotoById(id);
      if (photo) {
        if (photo.src && photo.src.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', photo.src);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await db.deletePhoto(id);
        deletedIds.push(id);
      }
    }

    res.json({ success: true, deletedCount: deletedIds.length, deletedIds });
  } catch (error) {
    console.error('Error batch deleting photos:', error);
    res.status(500).json({ error: 'Failed to delete photos' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    await db.initDb();
    const categories = await db.getCategories();
    res.json(categories.map(c => c.name));
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

router.post('/', async (req, res) => {
  try {
    await db.initDb();
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await db.createCategory(name.trim());
    if (!result) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    res.status(201).json({ success: true, categories: result.map(c => c.name) });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/', async (req, res) => {
  try {
    await db.initDb();
    const { oldName, newName } = req.body;

    if (!oldName || !newName || !newName.trim()) {
      return res.status(400).json({ error: 'oldName and newName are required' });
    }

    if (oldName === '全部') {
      return res.status(400).json({ error: 'Cannot rename "全部" category' });
    }

    const result = await db.updateCategoryName(oldName, newName);
    if (!result) {
      return res.status(400).json({ error: 'Failed to update category' });
    }

    res.json({ success: true, categories: result.map(c => c.name) });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:name', async (req, res) => {
  try {
    await db.initDb();
    const { name } = req.params;

    if (name === '全部') {
      return res.status(400).json({ error: 'Cannot delete "全部" category' });
    }

    const result = await db.deleteCategory(decodeURIComponent(name));
    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, categories: result.map(c => c.name) });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
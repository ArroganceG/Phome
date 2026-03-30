const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../data/db.sqlite');

let db = null;
let initPromise = null;

async function initDb() {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_FILE)) {
      const buffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        category TEXT DEFAULT '未分类',
        src TEXT NOT NULL,
        hash TEXT UNIQUE,
        date TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);

    try {
      db.run("CREATE INDEX IF NOT EXISTS idx_photos_hash ON photos(hash)");
    } catch (e) {
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt TEXT
      )
    `);

    const categoryCount = db.exec("SELECT COUNT(*) FROM categories")[0]?.values[0][0] || 0;
    if (categoryCount === 0) {
      const defaultCategories = ['全部', '运动', '课堂', '师生', '趣味活动', '日常', '作品', '未分类'];
      const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
      defaultCategories.forEach(name => stmt.run([name]));
      stmt.free();
    }

    const userCount = db.exec("SELECT COUNT(*) FROM users")[0]?.values[0][0] || 0;
    if (userCount === 0) {
      const hashedPassword = bcrypt.hashSync('Jqxx31415926', 10);
      db.run("INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)",
        ['default-admin', 'admin', hashedPassword, new Date().toISOString()]);
    }

    saveDb();
    return db;
  })();

  return initPromise;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

async function run(query, params = []) {
  await initDb();
  db.run(query, params);
  saveDb();
}

async function get(query, params = []) {
  await initDb();
  const stmt = db.prepare(query);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

async function all(query, params = []) {
  await initDb();
  const results = [];
  const stmt = db.prepare(query);
  stmt.bind(params);
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

async function getPhotos() {
  return all("SELECT * FROM photos ORDER BY createdAt DESC");
}

async function getPhotoById(id) {
  return get("SELECT * FROM photos WHERE id = ?", [id]);
}

async function getPhotoByTitle(title) {
  return get("SELECT * FROM photos WHERE title = ?", [title]);
}

async function getPhotoByHash(hash) {
  return get("SELECT * FROM photos WHERE hash = ?", [hash]);
}

async function createPhoto(photo) {
  await run("INSERT INTO photos (id, title, description, category, src, hash, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [photo.id, photo.title, photo.description || '', photo.category || '未分类', photo.src, photo.hash || null, photo.date, photo.createdAt]);
  return photo;
}

async function updatePhoto(id, updates) {
  const fields = [];
  const values = [];
  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
  if (fields.length > 0) {
    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);
    await run(`UPDATE photos SET ${fields.join(', ')} WHERE id = ?`, values);
  }
  return getPhotoById(id);
}

async function deletePhoto(id) {
  await run("DELETE FROM photos WHERE id = ?", [id]);
  return true;
}

async function getCategories() {
  return all("SELECT name FROM categories ORDER BY id");
}

async function getCategoryByName(name) {
  return get("SELECT * FROM categories WHERE name = ?", [name]);
}

async function createCategory(name) {
  try {
    await run("INSERT INTO categories (name) VALUES (?)", [name]);
    return getCategories();
  } catch (e) {
    return null;
  }
}

async function updateCategoryName(oldName, newName) {
  if (oldName === '全部') return null;
  try {
    await run("UPDATE categories SET name = ? WHERE name = ?", [newName, oldName]);
    await run("UPDATE photos SET category = ? WHERE category = ?", [newName, oldName]);
    return getCategories();
  } catch (e) {
    return null;
  }
}

async function deleteCategory(name) {
  if (name === '全部') return null;
  try {
    const existingUncat = await getCategoryByName('未分类');
    if (!existingUncat) {
      await run("INSERT INTO categories (name) VALUES ('未分类')");
    }
    await run("UPDATE photos SET category = '未分类' WHERE category = ?", [name]);
    await run("DELETE FROM categories WHERE name = ?", [name]);
    return getCategories();
  } catch (e) {
    return null;
  }
}

async function getUsers() {
  return all("SELECT id, username, createdAt FROM users");
}

async function getUserByUsername(username) {
  return get("SELECT * FROM users WHERE username = ?", [username]);
}

async function createUser(user) {
  await run("INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)",
    [user.id, user.username, user.password, user.createdAt]);
  return user;
}

async function verifyUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;
  if (bcrypt.compareSync(password, user.password)) {
    return { id: user.id, username: user.username };
  }
  return null;
}

module.exports = {
  initDb,
  getPhotos,
  getPhotoById,
  getPhotoByTitle,
  getPhotoByHash,
  createPhoto,
  updatePhoto,
  deletePhoto,
  getCategories,
  getCategoryByName,
  createCategory,
  updateCategoryName,
  deleteCategory,
  getUsers,
  getUserByUsername,
  createUser,
  verifyUser
};
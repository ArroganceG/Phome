const { getDb } = require('./utils/db');
const bcrypt = require('bcryptjs');

async function initDefaultUser() {
  const db = getDb();
  const users = db.get('users').value();

  const existingAdmin = users.find(u => u.username === 'admin');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Jqxx31415926', 10);
    db.get('users').push({
      id: 'default-admin',
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }).write();
    console.log('Default admin user created: admin / Jqxx31415926');
  } else {
    console.log('Admin user already exists');
  }
}

initDefaultUser().then(() => {
  console.log('Initialization complete');
  process.exit(0);
}).catch(err => {
  console.error('Initialization failed:', err);
  process.exit(1);
});
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data/db.json');

async function updateAdminPassword() {
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  const newHash = bcrypt.hashSync('Jqxx31415926', 10);

  const userIndex = data.users.findIndex(u => u.username === 'admin');
  if (userIndex !== -1) {
    data.users[userIndex].password = newHash;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('Admin password updated successfully!');
    console.log('New hash:', newHash);

    const verify = bcrypt.compareSync('Jqxx31415926', newHash);
    console.log('Verification:', verify ? 'PASSED' : 'FAILED');
  } else {
    console.log('Admin user not found');
  }
}

updateAdminPassword();
const express = require('express');
const cors = require('cors');
const path = require('path');
const photosRouter = require('./routes/photos');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/photos', photosRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
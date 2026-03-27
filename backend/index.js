import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// Admin schema/model
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', AdminSchema);

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Example schema/model
const ContentSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now }
});
const Content = mongoose.model('Content', ContentSchema);

// CRUD routes
app.get('/api/content', async (req, res) => {
  const items = await Content.find();
  res.json(items);
});

app.post('/api/content', async (req, res) => {
  const item = new Content(req.body);
  await item.save();
  res.status(201).json(item);
});

app.put('/api/content/:id', async (req, res) => {
  const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/content/:id', async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Ensure default admin exists
    const defaultAdmin = await Admin.findOne({ username: 'admin' });
    if (!defaultAdmin) {
      await Admin.create({ username: 'admin', password: '@leyarss2026' });
      console.log('Default admin created.');
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

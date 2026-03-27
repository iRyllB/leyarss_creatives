import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

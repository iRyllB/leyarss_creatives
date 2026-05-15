import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

/* -------------------- ADMIN LOGIN -------------------- */
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data || data.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------- CONTENT -------------------- */


// GET hero content
app.get('/api/content/hero', async (req, res) => {
  const { data, error } = await supabase.from('hero').select('*').single();
  if (error) return res.status(500).json({ error });
  res.json({ hero: data });
});

// UPDATE hero content
app.put('/api/content/hero', async (req, res) => {
  const { data, error } = await supabase
    .from('hero')
    .update(req.body)
    .eq('id', 1)
    .select()
    .single();
  if (error) return res.status(500).json({ error });
  res.json({ hero: data });
});

// GET about content
app.get('/api/content/about', async (req, res) => {
  const { data, error } = await supabase.from('about').select('*').single();
  if (error) return res.status(500).json({ error });
  res.json({ about: data });
});

// UPDATE about content
app.put('/api/content/about', async (req, res) => {
  const { data, error } = await supabase
    .from('about')
    .update(req.body)
    .eq('id', 1)
    .select()
    .single();
  if (error) return res.status(500).json({ error });
  res.json({ about: data });
});

// GET all services
app.get('/api/content/services', async (req, res) => {
  const { data, error } = await supabase.from('services').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// ADD a service
app.post('/api/content/services', async (req, res) => {
  const { data, error } = await supabase.from('services').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// UPDATE a service
app.put('/api/content/services/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('services')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// DELETE a service
app.delete('/api/content/services/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

// GET all portfolio items for a category
app.get('/api/content/portfolio/:category', async (req, res) => {
  const { category } = req.params;
  const { data, error } = await supabase.from('portfolio').select('*').eq('category', category);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// ADD a portfolio item
app.post('/api/content/portfolio/:category', async (req, res) => {
  const { category } = req.params;
  const { data, error } = await supabase.from('portfolio').insert([{ ...req.body, category }]).select().single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// UPDATE a portfolio item
app.put('/api/content/portfolio/:category/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('portfolio')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// DELETE a portfolio item
app.delete('/api/content/portfolio/:category/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('portfolio').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
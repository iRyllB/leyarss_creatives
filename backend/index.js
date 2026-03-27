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

// GET all content
app.get('/api/content', async (req, res) => {
  const { data, error } = await supabase
    .from('content')
    .select('*');

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CREATE content
app.post('/api/content', async (req, res) => {
  const { title, body } = req.body;

  const { data, error } = await supabase
    .from('content')
    .insert([{ title, body }]);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
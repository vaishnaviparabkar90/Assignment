
import express from 'express';
import cors from 'cors';
import sql, { testConnection } from './db.js';
import adminRoutes from './routes/admin.js';
const app = express();
import userRoutes from './routes/user.js';
import storeRoutes from './routes/store.js';
app.use(cors());
app.use(express.json());
// Test DB before starting server
testConnection().then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});

app.get('/test', async (req, res) => {
  res.json({ message: 'API is working' });
}); 
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api/store/', storeRoutes);

// ------------------ Signup Route ------------------
app.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body);

    const { name, email, address, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    const result = await sql`
      INSERT INTO users (name, email, address, password)
      VALUES (${name}, ${email}, ${address}, ${password})
      RETURNING id, name, email, address, created_at
    `;

    res.status(201).json({ message: 'User created', user: result[0] });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});
// ------------------ Login Route ------------------
app.post('/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body);

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Select table based on role
    let table;
    if (role === 'Admin') table = 'admins';
    else if (role === 'User') table = 'users';
    else if (role === 'Store') table = 'stores';
    else return res.status(400).json({ message: 'Invalid role' });
    const user = await sql`SELECT * FROM ${sql(table)} WHERE email = ${email}`;

    if (!user[0]) {
      return res.status(401).json({ message: 'email not found' });
    }
if (password !== user[0].password) {
  return res.status(401).json({ message: 'Invalid email or password' });
}
    res.status(200).json({ message: `Login successful as ${role}`, user: user[0] });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

import sql from '../db.js'; 

// Dashboard stats
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = (await sql`SELECT COUNT(*) FROM users`)[0].count;
    const totalStores = (await sql`SELECT COUNT(*) FROM stores`)[0].count;
    const totalRatings = (await sql`SELECT COUNT(rating) FROM stores WHERE rating IS NOT NULL`)[0].count;

    res.json({
      totalUsers: Number(totalUsers),
      totalStores: Number(totalStores),
      totalRatings: Number(totalRatings)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// List users or stores
export const listUsersOrStores = async (req, res) => {
  try {
    const type = req.query.type;

    if (type === 'users') {
      const users = await sql`SELECT id, name, email, address FROM users ORDER BY id DESC`;
      return res.json({ list: users });
    }

    if (type === 'stores') {
      const stores = await sql`SELECT id, name, email, address, rating FROM stores ORDER BY id DESC`;
      return res.json({ list: stores });
    }
      if (type === 'admins') {
      const admins = await sql`
        SELECT id, email 
        FROM admins 
        ORDER BY id DESC
      `;
      return res.json({ list: admins });
    }
    res.status(400).json({ message: 'Invalid type parameter' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a new user/store/admin
export const addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
console.log('Adding user/store/admin:', { name, email, address, role });
    if (role === 'Admin') {
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields for admin' });
  }
} else {
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
}
if (!role) {
  return res.status(400).json({ message: 'Role is required' });
}
    if (role === 'User') {
      const result = await sql`
        INSERT INTO users (name, email, address, password)
        VALUES (${name}, ${email}, ${address}, ${password})
        RETURNING id, name, email, address
      `;
      return res.status(201).json({ message: 'User added successfully', user: result[0] });
    }

    if (role === 'Store') {
      const result = await sql`
        INSERT INTO stores (name, email, address, password)
        VALUES (${name}, ${email}, ${address}, ${password})
        RETURNING id, name, email, address
      `;
      return res.status(201).json({ message: 'Store added successfully', store: result[0] });
    }

    if (role === 'Admin') {
      const result = await sql`
        INSERT INTO admins (email, password)
        VALUES (${email}, ${password})
        RETURNING id, email
      `;
      return res.status(201).json({ message: 'Admin added successfully', admin: result[0] });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

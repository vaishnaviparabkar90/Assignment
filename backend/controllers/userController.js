
import sql from '../db.js';

// GET /user/stores?userId=123
export const getStoresWithRatings = async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) return res.status(400).json({ message: 'Missing userEmail' });
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult[0].id;
    const stores = await sql`
      SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(ROUND(avg_r.avg_rating::numeric, 2), 0) AS overall_rating,
        COALESCE(ur.rating, 0) AS user_rating
      FROM stores s
      LEFT JOIN (
        SELECT store_id, AVG(rating) AS avg_rating
        FROM ratings
        GROUP BY store_id
      ) AS avg_r ON avg_r.store_id = s.id
      LEFT JOIN ratings ur
        ON ur.store_id = s.id AND ur.user_id = ${userId}
      ORDER BY s.id DESC
    `;
    res.json({ stores });
  } catch (err) {
    console.error('getStoresWithRatings error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// POST /user/ratings  { userId, storeId, rating }
export const upsertRating = async (req, res) => { 
  try {
    const { userEmail, storeId, rating } = req.body || {};
    if (!userEmail || !storeId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1–5' });
    }
    const user = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = user[0].id;
    await sql`
      INSERT INTO ratings (store_id, user_id, rating, created_at, updated_at)
      VALUES (${storeId}, ${userId}, ${rating}, NOW(), NOW())
      ON CONFLICT (store_id, user_id)
      DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
    `;
    const avgResult = await sql`
      SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating
      FROM ratings
      WHERE store_id = ${storeId}
    `;
    const avgRating = avgResult[0].avg_rating || 0;
    // Update the stores table
    await sql`
      UPDATE stores
      SET rating = ${avgRating}
      WHERE id = ${storeId}
    `;
    res.json({ message: 'Rating saved/updated successfully' });
  } catch (err) {
    console.error('upsertRating error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



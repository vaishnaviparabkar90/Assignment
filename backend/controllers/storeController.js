import sql from '../db.js';

export const dashboard =async (req, res) =>
{
  const { email } = req.params;
  console.log("[Dashboard] Request received for store email:", email);
  try {
   const store = await sql`
  SELECT id, rating AS avg_rating
  FROM stores
  WHERE email = ${email}
  LIMIT 1
`;
    console.log("[Dashboard] Store query result:", store);

    if (store.length === 0) {
      console.log("[Dashboard] Store not found for email:", email);
      return res.status(404).json({ error: "Store not found" });
    }

    const storeId = store[0].id;
    console.log("[Dashboard] Store ID:", storeId);

    // 2. Fetch all ratings 
    const ratings = await sql`
      SELECT r.id, r.user_id, r.rating, u.name AS user_name, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ${storeId}
      ORDER BY r.id DESC
    `;
    console.log(`[Dashboard] Ratings fetched:`, ratings);
    // 3. Return ratings + average 
    const response = {
      ratings,
      avg_rating: store[0].avg_rating || 0,
    };
    console.log("[Dashboard] Response:", response);

    res.json(response);
  } catch (err) {
    console.error("[Dashboard] Error fetching dashboard:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

export const UpdatePassword=async (req, res) => {
  const { storeEmail, oldPassword, newPassword } = req.body;
  //console.log("[UpdatePassword] Request body:", req.body);

  if (!storeEmail || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {

    const store = await sql`
      SELECT password
      FROM stores
      WHERE email = ${storeEmail}
      LIMIT 1
    `;
    console.log("[UpdatePassword] Store fetch result:", store);
    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }
    if (store[0].password !== oldPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }
    
    await sql`
      UPDATE stores
      SET password = ${newPassword}
      WHERE email = ${storeEmail}
    `;
    console.log("[UpdatePassword] Password updated successfully");

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[UpdatePassword] Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

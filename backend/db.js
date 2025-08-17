
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false } 
});

// Optional: function to test the connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 AS connected`;
    if (result[0].connected === 1) {
      console.log("✅ PostgreSQL connection successful!");
    } else {
      console.log("⚠️ PostgreSQL query did not return expected result.");
    }
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
}

export default sql;

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const parts = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
    if (parts) {
      databaseUrl = parts[1].replace(/['"]/g, '').trim();
    }
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    const res = await client.query('UPDATE users SET is_admin = TRUE RETURNING email');
    console.log("Updated users to Admin:");
    console.log(res.rows.map(r => r.email));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();

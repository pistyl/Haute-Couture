const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^DATABASE_URL=(.+)$/m);
  if (match) {
    databaseUrl = match[1].trim();
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Running subscription schema updates...");
    await client.query('BEGIN');

    // 1. Add subscription columns to users
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'FREE',
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '14 days'
    `);
    console.log("Subscription columns added to 'users' table.");

    // 2. Make order_id nullable in unitechpay_payments & add user_id column
    await client.query(`
      ALTER TABLE unitechpay_payments ALTER COLUMN order_id DROP NOT NULL;
      ALTER TABLE unitechpay_payments ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
    `);
    console.log("Nullable 'order_id' and new 'user_id' reference added to 'unitechpay_payments' table.");

    await client.query('COMMIT');
    console.log("Schema migration completed successfully!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Schema migration failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 1. Parse .env.local to load DATABASE_URL
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

if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Starting authentication & multi-tenancy migration...");
    await client.query('BEGIN');

    // 1. Create users table
    console.log("Creating users table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        atelier_name VARCHAR(255) DEFAULT 'Atelier Baobab',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Alter existing tables to add user_id column
    console.log("Adding user_id column to existing tables...");
    await client.query(`
      ALTER TABLE workshop_config ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
      ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
      ALTER TABLE stock ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE;
    `);

    // 3. Create default admin user if no users exist
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    let adminUserId = 'admin_user';
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log("No users found. Creating default admin account (admin@baobab.com)...");
      const defaultPassword = 'adminbaobab2026';
      const defaultHash = hashPassword(defaultPassword);
      await client.query(
        'INSERT INTO users (id, email, password_hash, atelier_name) VALUES ($1, $2, $3, $4)',
        [adminUserId, 'admin@baobab.com', defaultHash, 'Atelier Baobab']
      );
      console.log(`Default admin created: admin@baobab.com / ${defaultPassword}`);
    } else {
      const firstUser = await client.query('SELECT id FROM users LIMIT 1');
      adminUserId = firstUser.rows[0].id;
    }

    // 4. Associate any existing records with user_id NULL to the default user
    console.log("Associating existing records with default user...");
    await client.query('UPDATE workshop_config SET user_id = $1 WHERE user_id IS NULL', [adminUserId]);
    await client.query('UPDATE employees SET user_id = $1 WHERE user_id IS NULL', [adminUserId]);
    await client.query('UPDATE clients SET user_id = $1 WHERE user_id IS NULL', [adminUserId]);
    await client.query('UPDATE orders SET user_id = $1 WHERE user_id IS NULL', [adminUserId]);
    await client.query('UPDATE stock SET user_id = $1 WHERE user_id IS NULL', [adminUserId]);

    await client.query('COMMIT');
    console.log("Migration completed successfully!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Migration error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

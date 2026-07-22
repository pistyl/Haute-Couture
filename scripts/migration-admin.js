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

async function runAdminMigration() {
  const client = await pool.connect();
  try {
    console.log("Starting back-office admin migration...");
    await client.query('BEGIN');

    // 1. Add is_admin column to users table
    console.log("Adding is_admin column to users table...");
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
    `);

    // 2. Set default admin@baobab.com as administrator
    console.log("Setting admin@baobab.com as admin...");
    await client.query(`
      UPDATE users 
      SET is_admin = TRUE 
      WHERE email = 'admin@baobab.com';
    `);

    // 3. Create platform_settings table
    console.log("Creating platform_settings table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Seed default commission rate (5.0%)
    await client.query(`
      INSERT INTO platform_settings (key, value) 
      VALUES ('commission_rate', '5.0') 
      ON CONFLICT (key) DO NOTHING;
    `);

    // 4. Create disputes table
    console.log("Creating disputes table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        client_name VARCHAR(255),
        order_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, resolved, closed
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed mock disputes for demonstration if disputes count is 0
    const disputesCount = await client.query('SELECT COUNT(*) FROM disputes');
    if (parseInt(disputesCount.rows[0].count) === 0) {
      // Find a user to attach the mock dispute to
      const usersRes = await client.query('SELECT id FROM users LIMIT 1');
      if (usersRes.rows.length > 0) {
        const userId = usersRes.rows[0].id;
        console.log(`Seeding mock disputes for user ${userId}...`);
        
        await client.query(`
          INSERT INTO disputes (user_id, title, description, client_name, order_id, status, admin_notes)
          VALUES 
          ($1, 'Retard de livraison sur commande #ord_1', 'Le client réclame un remboursement partiel car le grand boubou n''a pas été livré à temps pour la fête de la Tabaski.', 'Fatou Diome', 'ord_1', 'pending', 'Appeler l''atelier pour vérifier le statut de fabrication.'),
          ($1, 'Erreur de mesure - Hanche trop serrée', 'Rokhaya Diallo affirme que la jupe longue est trop cintrée au niveau des hanches. Le tissu Wax fourni était de haute qualité.', 'Rokhaya Diallo', 'ord_3', 'in_progress', 'Proposer un rendez-vous d''ajustement gratuit.');
        `, [userId]);
      }
    }

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

runAdminMigration();

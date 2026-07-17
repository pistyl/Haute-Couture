import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export let pool;

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/m);
    if (match) {
      databaseUrl = match[1].replace(/['"]/g, '').trim();
    }
  }
  
  if (!databaseUrl && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/m);
    if (match) {
      databaseUrl = match[1].replace(/['"]/g, '').trim();
    }
  }
}

if (!global.pgPool) {
  console.log("Initializing PG Pool. URL loaded:", databaseUrl ? (databaseUrl.split('@')[1] || "exists") : "UNDEFINED");
  global.pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
pool = global.pgPool;

export async function query(text, params) {
  return pool.query(text, params);
}

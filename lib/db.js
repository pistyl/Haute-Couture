import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export let pool;

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const paths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env.local'),
    path.join(__dirname, '..', '..', '.env')
  ];
  
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const envContent = fs.readFileSync(p, 'utf8');
      const match = envContent.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/m);
      if (match) {
        databaseUrl = match[1].replace(/['"]/g, '').trim();
        console.log("Loaded DATABASE_URL from fallback path:", p);
        break;
      }
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

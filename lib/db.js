import { Pool } from 'pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export let pool;


if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
pool = global.pgPool;

export async function query(text, params) {
  return pool.query(text, params);
}

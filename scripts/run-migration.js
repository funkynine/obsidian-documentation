/**
 * Run Supabase migration.
 * Uses DATABASE_URL from .env.local (Supabase Dashboard → Project Settings → Database → Connection string)
 * Or SUPABASE_DB_PASSWORD with project ref from NEXT_PUBLIC_SUPABASE_URL
 */
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  let connectionString = process.env.DATABASE_URL;

  // Session pooler: build from parts if DATABASE_URL fails (password with [] often breaks parsing)
  const projectRef = 'jpktswxqeanamkymqwjg';
  const password = process.env.SUPABASE_DB_PASSWORD;
  const region = process.env.SUPABASE_DB_REGION || 'eu-west-1';
  if (password) {
    const encoded = encodeURIComponent(password);
    connectionString = `postgresql://postgres.${projectRef}:${encoded}@aws-1-${region}.pooler.supabase.com:5432/postgres`;
  }

  if (!connectionString) {
    console.error('Set DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local');
    process.exit(1);
  }

  const migrationPath = path.join(__dirname, '../supabase/migrations/20250214000000_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  const directMatch = connectionString.match(/postgresql:\/\/postgres:([^@]+)@db\.([a-zA-Z0-9]+)\.supabase\.co:5432/);
  const urlsToTry = [connectionString];
  if (directMatch) {
    const [, password, projectRef] = directMatch;
    for (const region of ['eu-central-1', 'us-east-1', 'ap-northeast-1']) {
      urlsToTry.push(`postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`);
    }
  }

  let lastErr;
  for (const url of urlsToTry) {
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      await client.query(sql);
      console.log('Migration completed successfully.');
      await client.end();
      return;
    } catch (err) {
      lastErr = err;
      await client.end().catch(() => {});
    }
  }
  console.error('Migration failed:', lastErr.message);
  if (connectionString.includes('db.') && lastErr.message.includes('getaddrinfo')) {
    console.error('\nHint: Direct connection (db.xxx) needs IPv6. Copy the "Session" mode connection string from Supabase Dashboard → Connect.');
  }
  process.exit(1);
}

main();

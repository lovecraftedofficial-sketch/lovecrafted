/**
 * Production Database Connection Module for LoveCrafted
 * ----------------------------------------------------
 * Connects to PostgreSQL / Supabase instance using environment configuration.
 */

const { Client } = require("pg");

function getDbClient() {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    return null;
  }

  return new Client({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
}

/**
 * Execute a parameterized SQL query on production database
 */
async function query(sql, params = []) {
  const client = getDbClient();
  if (!client) {
    console.warn("[DB] No DATABASE_URL configured. Operating in fallback mode.");
    return null;
  }

  try {
    await client.connect();
    const result = await client.query(sql, params);
    await client.end();
    return result;
  } catch (err) {
    console.error("[DB Query Error]", { sql, error: err.message });
    try { await client.end(); } catch {}
    throw err;
  }
}

module.exports = { query, getDbClient };

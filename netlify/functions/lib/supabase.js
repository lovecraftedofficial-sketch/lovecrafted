/**
 * Production Supabase Client Module for LoveCrafted
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://jkszpflktmicbwfkowqx.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (!SUPABASE_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

module.exports = {
  SUPABASE_URL,
  getSupabaseClient,
};

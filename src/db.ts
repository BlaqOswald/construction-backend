import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  // 🔥 THIS IS THE KEY FIX FOR SUPABASE + WSL
  keepAlive: true,
});

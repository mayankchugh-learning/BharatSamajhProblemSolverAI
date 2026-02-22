import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const isUsingDatabase = !!process.env.DATABASE_URL;

function createPool(): pg.Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Cannot use DatabaseStorage without a PostgreSQL connection string."
    );
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ...(process.env.NODE_ENV === "production" && {
      ssl: { rejectUnauthorized: false },
    }),
  });
}

export const pool: pg.Pool = isUsingDatabase ? createPool() : (null as never);

export const db = isUsingDatabase ? drizzle(pool, { schema }) : (null as never);

if (isUsingDatabase) {
  pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err.message);
  });
}

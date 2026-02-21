import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const isUsingDatabase = !!process.env.DATABASE_URL;

export const pool = isUsingDatabase
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as pg.Pool);

export const db = isUsingDatabase
  ? drizzle(pool, { schema })
  : (null as any);

import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __build6Pool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: { rejectUnauthorized: true },
  });
}

export const db = global.__build6Pool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__build6Pool = db;
}

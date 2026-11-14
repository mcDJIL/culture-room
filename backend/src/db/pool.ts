import pg from "pg";
import { config } from "../config.js";

// if (!config.databaseUrl) {
//   throw new Error("DATABASE_URL belum diisi di backend/.env");
// }

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

export async function withTransaction<T>(run: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await run(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

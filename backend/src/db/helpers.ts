import { HttpError } from "../http.js";
import { pool } from "./pool.js";

export type ViewerTable =
  | "viewer_liked_posts"
  | "viewer_saved_posts"
  | "viewer_connections"
  | "viewer_followed_organizations"
  | "viewer_followed_disciplines"
  | "viewer_joined_collaborations";

type EntityTable =
  | "disciplines"
  | "posts"
  | "network_profiles"
  | "organizations"
  | "collaborations"
  | "listings";

export async function ensureExists(table: EntityTable, id: string | number, label: string) {
  const result = await pool.query(`SELECT 1 FROM ${table} WHERE id = $1`, [id]);
  if (result.rowCount === 0) {
    throw new HttpError(404, `${label} tidak ditemukan`);
  }
}

export async function ensureDiscipline(name: string) {
  const result = await pool.query("SELECT 1 FROM disciplines WHERE name = $1", [name]);
  if (result.rowCount === 0) {
    throw new HttpError(400, "Data yang dikirim tidak valid", [
      { path: "discipline", message: "Kluster seni tidak dikenal" },
    ]);
  }
}

export async function setViewerLink(
  table: ViewerTable,
  userId: string,
  itemId: string | number,
  active: boolean,
) {
  if (active) {
    await pool.query(`INSERT INTO ${table} (user_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, itemId]);
    return;
  }
  await pool.query(`DELETE FROM ${table} WHERE user_id = $1 AND item_id = $2`, [userId, itemId]);
}

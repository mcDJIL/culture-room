import { Router } from "express";
import { currentUser, optionalAuth, requireAuth, viewerId, type AuthUser } from "../auth.js";
import { ensureDiscipline, ensureExists, setViewerLink } from "../db/helpers.js";
import { pool } from "../db/pool.js";
import { parseInput, routeParam } from "../http.js";
import { profileInput, searchQuery, toggleInput } from "../schemas.js";

export const profileRouter = Router();

profileRouter.get("/profile", requireAuth, (_req, res) => {
  res.json(currentUser(res));
});

profileRouter.put("/profile", requireAuth, async (req, res) => {
  const input = parseInput(profileInput, req.body);
  if (input.discipline) {
    await ensureDiscipline(input.discipline);
  }

  const result = await pool.query<AuthUser>(
    `UPDATE users SET
       name = COALESCE($2, name),
       headline = COALESCE($3, headline),
       location = CASE WHEN $4::boolean THEN $5 ELSE location END,
       discipline = CASE WHEN $6::boolean THEN $7 ELSE discipline END
     WHERE id = $1
     RETURNING id, name, email, headline, location, discipline`,
    [
      currentUser(res).id,
      input.name ?? null,
      input.headline ?? null,
      input.location !== undefined,
      input.location ?? null,
      input.discipline !== undefined,
      input.discipline ?? null,
    ],
  );
  res.json(result.rows[0]);
});

profileRouter.get("/disciplines", optionalAuth, async (_req, res) => {
  const result = await pool.query(
    `SELECT d.id, d.name, d.note, d.visual, d.credit,
       EXISTS (SELECT 1 FROM viewer_followed_disciplines f WHERE f.item_id = d.id AND f.user_id = $1) AS followed
     FROM disciplines d
     ORDER BY d.sort_order`,
    [viewerId(res)],
  );
  res.json(result.rows);
});

profileRouter.put("/disciplines/:id/follow", requireAuth, async (req, res) => {
  const disciplineId = routeParam(req.params.id);
  await ensureExists("disciplines", disciplineId, "Kluster");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_followed_disciplines", currentUser(res).id, disciplineId, active);
  res.json({ id: disciplineId, followed: active });
});

profileRouter.get("/opportunities", async (_req, res) => {
  const result = await pool.query("SELECT id, title, detail FROM opportunities ORDER BY sort_order");
  res.json(result.rows);
});

profileRouter.get("/search", async (req, res) => {
  const { q } = parseInput(searchQuery, req.query);
  const term = q.trim();
  if (!term) {
    res.json([]);
    return;
  }

  const result = await pool.query(
    `SELECT * FROM (
       SELECT 'Kluster' AS type, id, name AS title, 'jejaring' AS view FROM disciplines WHERE name ILIKE $1
       UNION ALL
       SELECT 'Jasa', id, title, 'jasa' FROM listings WHERE kind = 'service' AND title ILIKE $1
       UNION ALL
       SELECT 'Workshop', id, title, 'workshop' FROM workshops WHERE title ILIKE $1
       UNION ALL
       SELECT 'Kolaborasi', id, title, 'kolaborasi' FROM collaborations WHERE title ILIKE $1
     ) results
     LIMIT 6`,
    [`%${term}%`],
  );
  res.json(result.rows);
});

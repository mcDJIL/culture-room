import { Router } from "express";
import { currentUser, optionalAuth, requireAuth, viewerId } from "../auth.js";
import { ensureDiscipline, ensureExists, setViewerLink } from "../db/helpers.js";
import { pool } from "../db/pool.js";
import { parseInput, routeParam } from "../http.js";
import { draftInput, toggleInput } from "../schemas.js";

export const collaborationsRouter = Router();

collaborationsRouter.get("/collaborations", optionalAuth, async (_req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.field, c.title, c.need,
       EXISTS (SELECT 1 FROM viewer_joined_collaborations j WHERE j.item_id = c.id AND j.user_id = $1) AS joined
     FROM collaborations c
     ORDER BY c.sort_order`,
    [viewerId(res)],
  );
  res.json(result.rows);
});

collaborationsRouter.put("/collaborations/:id/interest", requireAuth, async (req, res) => {
  const collaborationId = routeParam(req.params.id);
  await ensureExists("collaborations", collaborationId, "Kolaborasi");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_joined_collaborations", currentUser(res).id, collaborationId, active);
  res.json({ id: collaborationId, joined: active });
});

collaborationsRouter.post("/collaboration-drafts", requireAuth, async (req, res) => {
  const input = parseInput(draftInput, req.body);
  await ensureDiscipline(input.discipline);
  const result = await pool.query(
    `INSERT INTO drafts (kind, title, discipline, description, user_id)
     VALUES ('collaboration', $1, $2, $3, $4)
     RETURNING id, title, discipline, description, created_at AS "createdAt"`,
    [input.title, input.discipline, input.description, currentUser(res).id],
  );
  res.status(201).json({ ...result.rows[0], status: "draft" });
});

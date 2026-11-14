import { Router } from "express";
import { currentUser, optionalAuth, requireAuth, viewerId } from "../auth.js";
import { ensureExists, setViewerLink } from "../db/helpers.js";
import { pool } from "../db/pool.js";
import { HttpError, parseInput, routeParam } from "../http.js";
import { applicationInput, toggleInput } from "../schemas.js";

export const networkRouter = Router();

networkRouter.get("/network/profiles", optionalAuth, async (_req, res) => {
  const result = await pool.query(
    `SELECT np.id, np.name, np.headline, np.location, np.disciplines, np.banner, np.credit,
       EXISTS (SELECT 1 FROM viewer_connections c WHERE c.item_id = np.id AND c.user_id = $1) AS connected
     FROM network_profiles np
     ORDER BY np.sort_order`,
    [viewerId(res)],
  );
  res.json(result.rows);
});

networkRouter.put("/network/profiles/:id/connection", requireAuth, async (req, res) => {
  const profileId = routeParam(req.params.id);
  await ensureExists("network_profiles", profileId, "Profil");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_connections", currentUser(res).id, profileId, active);
  res.json({ id: profileId, connected: active });
});

networkRouter.get("/organizations", optionalAuth, async (_req, res) => {
  const result = await pool.query(
    `SELECT o.id, o.name, o.type, o.location, o.description, o.disciplines, o.accepting, o.banner, o.credit,
       EXISTS (SELECT 1 FROM viewer_followed_organizations f WHERE f.item_id = o.id AND f.user_id = $1) AS followed
     FROM organizations o
     ORDER BY o.sort_order`,
    [viewerId(res)],
  );
  res.json(result.rows);
});

networkRouter.put("/organizations/:id/follow", requireAuth, async (req, res) => {
  const organizationId = routeParam(req.params.id);
  await ensureExists("organizations", organizationId, "Organisasi");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_followed_organizations", currentUser(res).id, organizationId, active);
  res.json({ id: organizationId, followed: active });
});

networkRouter.post("/organizations/:id/applications", requireAuth, async (req, res) => {
  const organizationId = routeParam(req.params.id);
  const organization = await pool.query<{ accepting: boolean }>(
    "SELECT accepting FROM organizations WHERE id = $1",
    [organizationId],
  );
  if (organization.rowCount === 0) {
    throw new HttpError(404, "Organisasi tidak ditemukan");
  }
  const { reason } = parseInput(applicationInput, req.body);
  if (!organization.rows[0].accepting) {
    throw new HttpError(409, "Organisasi ini tidak menerima pengajuan saat ini");
  }

  const result = await pool.query(
    `INSERT INTO organization_applications (organization_id, user_id, reason)
     VALUES ($1, $2, $3)
     RETURNING id, organization_id AS "organizationId", reason, created_at AS "createdAt"`,
    [organizationId, currentUser(res).id, reason],
  );
  res.status(201).json(result.rows[0]);
});

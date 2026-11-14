import { Router } from "express";
import { currentUser, optionalAuth, requireAuth, viewerId } from "../auth.js";
import { ensureDiscipline, ensureExists, setViewerLink } from "../db/helpers.js";
import { pool } from "../db/pool.js";
import { HttpError, parseInput, routeParam } from "../http.js";
import { commentInput, postInput, toggleInput } from "../schemas.js";

export const postsRouter = Router();

const postColumns = `
  p.id, p.author, p.discipline, p.location, p.type, p.body, p.image,
  p.image_alt AS "imageAlt", p.image_credit AS "imageCredit", p.tags,
  COALESCE(p.author_id = $1, false) AS "isOwn",
  EXISTS (SELECT 1 FROM viewer_liked_posts l WHERE l.item_id = p.id AND l.user_id = $1) AS liked,
  EXISTS (SELECT 1 FROM viewer_saved_posts s WHERE s.item_id = p.id AND s.user_id = $1) AS saved`;

function parsePostId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id)) {
    throw new HttpError(404, "Postingan tidak ditemukan");
  }
  return id;
}

async function fetchPost(id: number, viewer: string | null) {
  const result = await pool.query(`SELECT ${postColumns} FROM posts p WHERE p.id = $2`, [viewer, id]);
  return result.rows[0];
}

postsRouter.get("/posts", optionalAuth, async (_req, res) => {
  const result = await pool.query(
    `SELECT ${postColumns} FROM posts p ORDER BY p.created_at DESC, p.id ASC`,
    [viewerId(res)],
  );
  res.json(result.rows);
});

postsRouter.post("/posts", requireAuth, async (req, res) => {
  const input = parseInput(postInput, req.body);
  await ensureDiscipline(input.discipline);

  const user = currentUser(res);
  const inserted = await pool.query<{ id: number }>(
    `INSERT INTO posts (author, author_id, discipline, location, type, body, tags)
     VALUES ($1, $2, $3, $4, $5, $6, '{}')
     RETURNING id`,
    [user.name, user.id, input.discipline, user.location ?? "Lokasi belum diisi", "Karya dan gagasan", input.body],
  );
  res.status(201).json(await fetchPost(inserted.rows[0].id, user.id));
});

postsRouter.put("/posts/:id/like", requireAuth, async (req, res) => {
  const postId = parsePostId(routeParam(req.params.id));
  await ensureExists("posts", postId, "Postingan");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_liked_posts", currentUser(res).id, postId, active);
  res.json({ id: postId, liked: active });
});

postsRouter.put("/posts/:id/save", requireAuth, async (req, res) => {
  const postId = parsePostId(routeParam(req.params.id));
  await ensureExists("posts", postId, "Postingan");
  const { active } = parseInput(toggleInput, req.body);
  await setViewerLink("viewer_saved_posts", currentUser(res).id, postId, active);
  res.json({ id: postId, saved: active });
});

postsRouter.get("/posts/:id/comments", async (req, res) => {
  const postId = parsePostId(routeParam(req.params.id));
  await ensureExists("posts", postId, "Postingan");
  const result = await pool.query(
    `SELECT c.id, c.body, c.created_at AS "createdAt", u.name AS author
     FROM post_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId],
  );
  res.json(result.rows);
});

postsRouter.post("/posts/:id/comments", requireAuth, async (req, res) => {
  const postId = parsePostId(routeParam(req.params.id));
  await ensureExists("posts", postId, "Postingan");
  const input = parseInput(commentInput, req.body);
  const user = currentUser(res);
  const result = await pool.query(
    `INSERT INTO post_comments (post_id, user_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, body, created_at AS "createdAt"`,
    [postId, user.id, input.body],
  );
  res.status(201).json({ ...result.rows[0], author: user.name });
});

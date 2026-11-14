import { Router } from "express";
import {
  createSession,
  currentUser,
  deleteSession,
  hashPassword,
  requireAuth,
  verifyPassword,
  type AuthUser,
} from "../auth.js";
import { pool } from "../db/pool.js";
import { HttpError, parseInput } from "../http.js";
import { loginInput, registerInput } from "../schemas.js";

export const authRouter = Router();

authRouter.post("/auth/register", async (req, res) => {
  const input = parseInput(registerInput, req.body);
  const passwordHash = await hashPassword(input.password);

  let user: AuthUser;
  try {
    const result = await pool.query<AuthUser>(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, headline, location, discipline`,
      [input.email, passwordHash, input.name],
    );
    user = result.rows[0];
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      throw new HttpError(409, "Email sudah terdaftar");
    }
    throw error;
  }

  const token = await createSession(user.id);
  res.status(201).json({ token, user });
});

authRouter.post("/auth/login", async (req, res) => {
  const input = parseInput(loginInput, req.body);
  const result = await pool.query<AuthUser & { password_hash: string }>(
    `SELECT id, name, email, headline, location, discipline, password_hash
     FROM users WHERE email = $1`,
    [input.email],
  );
  const row = result.rows[0];
  const valid = row ? await verifyPassword(input.password, row.password_hash) : false;
  if (!row || !valid) {
    throw new HttpError(401, "Email atau kata sandi salah");
  }

  const user: AuthUser = {
    id: row.id,
    name: row.name,
    email: row.email,
    headline: row.headline,
    location: row.location,
    discipline: row.discipline,
  };
  const token = await createSession(user.id);
  res.json({ token, user });
});

authRouter.post("/auth/logout", requireAuth, async (_req, res) => {
  await deleteSession(res.locals.token);
  res.status(204).end();
});

authRouter.get("/auth/me", requireAuth, (_req, res) => {
  res.json(currentUser(res));
});

import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";
import { pool } from "./db/pool.js";
import { HttpError } from "./http.js";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const SESSION_DAYS = 30;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  headline: string;
  location: string | null;
  discipline: string | null;
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltText, hashText] = stored.split("$");
  if (scheme !== "scrypt" || !saltText || !hashText) {
    return false;
  }
  const expected = Buffer.from(hashText, "base64");
  const actual = await scrypt(password, Buffer.from(saltText, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await pool.query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))",
    [hashToken(token), userId, SESSION_DAYS],
  );
  return token;
}

export async function deleteSession(token: string) {
  await pool.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
}

function readBearerToken(req: Request) {
  const match = /^Bearer (.+)$/.exec(req.get("authorization") ?? "");
  return match?.[1] ?? null;
}

async function findSessionUser(token: string | null): Promise<AuthUser | null> {
  if (!token) {
    return null;
  }
  const result = await pool.query<AuthUser>(
    `SELECT u.id, u.name, u.email, u.headline, u.location, u.discipline
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
  return result.rows[0] ?? null;
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  res.locals.user = await findSessionUser(token);
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  const user = await findSessionUser(token);
  if (!user || !token) {
    throw new HttpError(401, "Silakan masuk terlebih dahulu");
  }
  res.locals.user = user;
  res.locals.token = token;
  next();
}

export function currentUser(res: Response): AuthUser {
  return res.locals.user as AuthUser;
}

export function viewerId(res: Response): string | null {
  return (res.locals.user as AuthUser | null)?.id ?? null;
}

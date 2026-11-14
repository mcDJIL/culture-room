import { Router } from "express";
import { pool } from "../db/pool.js";
import { HttpError, parseInput, routeParam } from "../http.js";
import { workshopQuery } from "../schemas.js";

export const workshopsRouter = Router();

workshopsRouter.get("/workshops", async (req, res) => {
  const { cluster } = parseInput(workshopQuery, req.query);
  const result = await pool.query(
    `SELECT id, cluster, title, format, description
     FROM workshops
     WHERE ($1::text IS NULL OR cluster = $1)
     ORDER BY sort_order`,
    [cluster ?? null],
  );
  res.json(result.rows);
});

workshopsRouter.get("/workshops/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT id, cluster, title, format, description FROM workshops WHERE id = $1",
    [routeParam(req.params.id)],
  );
  if (result.rowCount === 0) {
    throw new HttpError(404, "Workshop tidak ditemukan");
  }
  res.json(result.rows[0]);
});

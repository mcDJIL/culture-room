import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { errorHandler } from "./http.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiRouter);
app.use((_req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});
app.use(errorHandler);

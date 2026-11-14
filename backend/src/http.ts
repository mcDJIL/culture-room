import type { ErrorRequestHandler } from "express";
import type { z } from "zod";

export class HttpError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Express 5 mengetik req.params sebagai string | string[]; rute ":id" selalu string.
export function routeParam(value: string | string[]): string {
  if (typeof value !== "string") {
    throw new HttpError(404, "Data tidak ditemukan");
  }
  return value;
}

export function parseInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new HttpError(
      400,
      "Data yang dikirim tidak valid",
      result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    );
  }
  return result.data;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, details: error.details });
    return;
  }

  const status = (error as { status?: unknown } | null)?.status;
  if (typeof status === "number" && status >= 400 && status < 500) {
    res.status(status).json({ error: "Permintaan tidak valid" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
};

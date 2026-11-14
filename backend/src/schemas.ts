import { z } from "zod";

const description = z.string().trim().min(1, "Isi wajib diisi").max(2000);
const disciplineName = z.string().trim().min(1, "Kluster wajib dipilih").max(80);

export const toggleInput = z.object({ active: z.boolean() });

export const registerInput = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().toLowerCase().pipe(z.email("Email tidak valid")),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(128),
});

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1, "Kata sandi wajib diisi").max(128),
});

export const profileInput = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80).optional(),
  headline: z.string().trim().max(160).optional(),
  location: z.string().trim().max(120).nullable().optional(),
  discipline: disciplineName.nullable().optional(),
});

export const postInput = z.object({
  discipline: disciplineName,
  body: description,
});

export const commentInput = z.object({
  body: z.string().trim().min(1, "Tanggapan wajib diisi").max(1000),
});

export const draftInput = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(160),
  discipline: disciplineName,
  description,
});

export const applicationInput = z.object({
  reason: z.string().trim().min(20, "Tuliskan minimal 20 karakter.").max(2000),
});

export const bookingInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Waktu tidak valid"),
});

export const orderInput = z.object({
  quantity: z.number().int().min(1),
});

export const workshopQuery = z.object({
  cluster: z.string().optional(),
});

export const listingQuery = z.object({
  kind: z.enum(["service", "product"]).optional(),
});

export const searchQuery = z.object({
  q: z.string().max(100).default(""),
});

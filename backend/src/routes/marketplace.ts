import { randomUUID } from "node:crypto";
import { Router } from "express";
import { currentUser, requireAuth } from "../auth.js";
import { ensureDiscipline } from "../db/helpers.js";
import { pool, withTransaction } from "../db/pool.js";
import { HttpError, parseInput, routeParam } from "../http.js";
import { bookingInput, draftInput, listingQuery, orderInput } from "../schemas.js";
import type { Slot } from "../types.js";

export const marketplaceRouter = Router();

marketplaceRouter.get("/listings", async (req, res) => {
  const { kind } = parseInput(listingQuery, req.query);
  const listings = await pool.query<{ id: string; kind: string }>(
    `SELECT id, kind, title, discipline, location, description, price, unit, stock, image, credit
     FROM listings
     WHERE ($1::text IS NULL OR kind = $1)
     ORDER BY sort_order`,
    [kind ?? null],
  );
  const slotRows = await pool.query<Slot & { listing_id: string }>(
    `SELECT listing_id, id, slot_date AS date, slot_time AS time, status
     FROM slots
     ORDER BY sort_order`,
  );

  const slotsByListing = new Map<string, Slot[]>();
  for (const { listing_id, ...slot } of slotRows.rows) {
    slotsByListing.set(listing_id, [...(slotsByListing.get(listing_id) ?? []), slot]);
  }

  res.json(
    listings.rows.map((listing) => ({
      ...listing,
      slots: listing.kind === "service" ? (slotsByListing.get(listing.id) ?? []) : undefined,
    })),
  );
});

marketplaceRouter.post("/listings/:id/bookings", requireAuth, async (req, res) => {
  const listingId = routeParam(req.params.id);
  const { date, time } = parseInput(bookingInput, req.body);
  const user = currentUser(res);

  const result = await withTransaction(async (client) => {
    const listing = await client.query<{ kind: string }>("SELECT kind FROM listings WHERE id = $1", [listingId]);
    if (listing.rowCount === 0) {
      throw new HttpError(404, "Jasa tidak ditemukan");
    }
    if (listing.rows[0].kind !== "service") {
      throw new HttpError(400, "Listing ini tidak menggunakan jadwal");
    }

    const existing = await client.query<Slot>(
      `SELECT id, slot_date AS date, slot_time AS time, status
       FROM slots WHERE listing_id = $1 AND slot_date = $2 AND slot_time = $3
       FOR UPDATE`,
      [listingId, date, time],
    );

    let slot: Slot;
    if (existing.rows.length > 0) {
      if (existing.rows[0].status === "booked") {
        throw new HttpError(409, "Tanggal dan waktu ini sudah dipesan. Pilih jadwal lain.");
      }
      slot = { ...existing.rows[0], status: "booked" };
      await client.query("UPDATE slots SET status = 'booked' WHERE id = $1", [slot.id]);
    } else {
      try {
        const inserted = await client.query<Slot>(
          `INSERT INTO slots (id, listing_id, slot_date, slot_time, status, sort_order)
           VALUES ($1, $2, $3, $4, 'booked',
             (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM slots WHERE listing_id = $2))
           RETURNING id, slot_date AS date, slot_time AS time, status`,
          [randomUUID(), listingId, date, time],
        );
        slot = inserted.rows[0];
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          throw new HttpError(409, "Tanggal dan waktu ini baru saja dipesan. Pilih jadwal lain.");
        }
        throw error;
      }
    }

    const booking = await client.query(
      `INSERT INTO bookings (listing_id, slot_id, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, listing_id AS "listingId", slot_id AS "slotId", created_at AS "createdAt"`,
      [listingId, slot.id, user.id],
    );
    return { booking: booking.rows[0], slot };
  });

  res.status(201).json(result);
});

marketplaceRouter.post("/listings/:id/orders", requireAuth, async (req, res) => {
  const listingId = routeParam(req.params.id);
  const { quantity } = parseInput(orderInput, req.body);
  const user = currentUser(res);

  const result = await withTransaction(async (client) => {
    const listing = await client.query<{ kind: string }>("SELECT kind FROM listings WHERE id = $1", [listingId]);
    if (listing.rowCount === 0) {
      throw new HttpError(404, "Produk tidak ditemukan");
    }
    if (listing.rows[0].kind !== "product") {
      throw new HttpError(400, "Listing ini bukan produk");
    }

    const stock = await client.query<{ stock: number }>(
      "UPDATE listings SET stock = stock - $2 WHERE id = $1 AND stock >= $2 RETURNING stock",
      [listingId, quantity],
    );
    if (stock.rowCount === 0) {
      throw new HttpError(409, "Stok tidak mencukupi");
    }

    const order = await client.query(
      `INSERT INTO orders (listing_id, quantity, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, listing_id AS "listingId", quantity, created_at AS "createdAt"`,
      [listingId, quantity, user.id],
    );
    return { order: order.rows[0], stock: stock.rows[0].stock };
  });

  res.status(201).json(result);
});

marketplaceRouter.post("/service-drafts", requireAuth, async (req, res) => {
  const input = parseInput(draftInput, req.body);
  await ensureDiscipline(input.discipline);
  const result = await pool.query(
    `INSERT INTO drafts (kind, title, discipline, description, user_id)
     VALUES ('service', $1, $2, $3, $4)
     RETURNING id, title, discipline, description, created_at AS "createdAt"`,
    [input.title, input.discipline, input.description, currentUser(res).id],
  );
  res.status(201).json({ ...result.rows[0], status: "draft" });
});

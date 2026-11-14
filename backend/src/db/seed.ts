import { createSeedState } from "../data/seed.js";
import { pool, withTransaction } from "./pool.js";

const data = createSeedState();

await withTransaction(async (client) => {
  for (const [index, item] of data.disciplines.entries()) {
    await client.query(
      `INSERT INTO disciplines (id, name, note, visual, credit, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.name, item.note, item.visual, item.credit, index],
    );
  }

  for (const [index, item] of data.networkProfiles.entries()) {
    await client.query(
      `INSERT INTO network_profiles (id, name, headline, location, disciplines, banner, credit, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.name, item.headline, item.location, item.disciplines, item.banner, item.credit, index],
    );
  }

  for (const [index, item] of data.organizations.entries()) {
    await client.query(
      `INSERT INTO organizations (id, name, type, location, description, disciplines, accepting, banner, credit, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.name,
        item.type,
        item.location,
        item.description,
        item.disciplines,
        item.accepting,
        item.banner,
        item.credit,
        index,
      ],
    );
  }

  for (const [index, item] of data.opportunities.entries()) {
    await client.query(
      `INSERT INTO opportunities (id, title, detail, sort_order)
       VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.title, item.detail, index],
    );
  }

  for (const [index, item] of data.workshops.entries()) {
    await client.query(
      `INSERT INTO workshops (id, cluster, title, format, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.cluster, item.title, item.format, item.description, index],
    );
  }

  for (const [index, item] of data.listings.entries()) {
    await client.query(
      `INSERT INTO listings (id, kind, title, discipline, location, description, price, unit, stock, image, credit, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.kind,
        item.title,
        item.discipline,
        item.location,
        item.description,
        item.price,
        item.unit,
        item.stock ?? null,
        item.image,
        item.credit,
        index,
      ],
    );
    for (const [slotIndex, slot] of (item.slots ?? []).entries()) {
      await client.query(
        `INSERT INTO slots (id, listing_id, slot_date, slot_time, status, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           slot_date = EXCLUDED.slot_date,
           slot_time = EXCLUDED.slot_time,
           status = EXCLUDED.status,
           sort_order = EXCLUDED.sort_order`,
        [slot.id, item.id, slot.date, slot.time, slot.status, slotIndex],
      );
    }
  }

  for (const [index, item] of data.collaborations.entries()) {
    await client.query(
      `INSERT INTO collaborations (id, field, title, need, sort_order)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.field, item.title, item.need, index],
    );
  }

  for (const item of data.posts) {
    await client.query(
      `INSERT INTO posts (id, author, discipline, location, type, body, image, image_alt, image_credit, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.author,
        item.discipline,
        item.location,
        item.type,
        item.body,
        item.image ?? null,
        item.imageAlt ?? null,
        item.imageCredit ?? null,
        item.tags,
      ],
    );
  }
  await client.query(
    "SELECT setval(pg_get_serial_sequence('posts', 'id'), GREATEST((SELECT max(id) FROM posts), 1))",
  );
});

await pool.end();
console.log("Data demo berhasil dimasukkan");

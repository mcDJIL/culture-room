CREATE UNIQUE INDEX IF NOT EXISTS slots_listing_datetime_idx
  ON slots (listing_id, slot_date, slot_time);

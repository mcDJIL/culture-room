import { useState } from "react";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { marketplaceListings } from "@/data/demoData";

export function ServicesPage({ onCreate }: { onCreate: () => void }) {
  const [tab, setTab] = useState<"all" | "service" | "product">("all");
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<Record<string, string>>({});
  const visible = tab === "all" ? marketplaceListings : marketplaceListings.filter((item) => item.kind === tab);
  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="page-wrap">
      <PageHeader
        action={<button className="primary-button" onClick={onCreate} type="button"><Icon name="plus" /> Tawarkan jasa</button>}
        eyebrow="Marketplace seni budaya"
        text="Temukan keahlian, pilih jadwal pertunjukan, atau beli karya langsung dari pelaku budaya."
        title="Sewa keahlian atau bawa pulang karya."
      />
      <div className="market-tabs">
        {([
          ["all", "Semua"],
          ["service", "Penyewaan jasa"],
          ["product", "Produk karya"],
        ] as const).map(([value, label]) => (
          <button className={tab === value ? "active" : ""} key={value} onClick={() => setTab(value)} type="button">{label}</button>
        ))}
      </div>
      <div className="market-list">
        {visible.map((item) => item.kind === "service" ? (
          <article className="ticket-card" key={item.id}>
            <div className="ticket-summary">
              <figure><img alt="" src={item.image} /><figcaption>Foto: {item.credit}</figcaption></figure>
              <div>
                <span className="eyebrow">Penyewaan jasa</span>
                <h2>{item.title}</h2>
                <strong>{item.discipline} · {item.location}</strong>
                <p>{item.description}</p>
                <div className="price-block">
                  <small>Harga mulai dari</small>
                  <b>{formatPrice(item.price)}</b>
                  <span>{item.unit}</span>
                </div>
              </div>
            </div>
            <div className="ticket-slots">
              <div className="ticket-heading">
                <div><span className="eyebrow">Pilih jadwal</span><h3>Tiket ketersediaan</h3></div>
                <small>Jadwal terpesan tidak dapat dipilih</small>
              </div>
              <div className="slot-grid">
                {item.slots.map((slot) => {
                  const booked = slot.status === "booked";
                  const selected = selectedSlots[item.id] === slot.id;
                  return (
                    <button
                      aria-pressed={selected}
                      className={booked ? "slot booked" : selected ? "slot selected" : "slot"}
                      disabled={booked}
                      key={slot.id}
                      onClick={() => setSelectedSlots((current) => ({ ...current, [item.id]: slot.id }))}
                      type="button"
                    >
                      <strong>{slot.date}</strong>
                      <span>{slot.time}</span>
                      <small>{booked ? "Sudah dipesan" : selected ? "Dipilih" : "Tersedia"}</small>
                    </button>
                  );
                })}
              </div>
              <button
                className="primary-button book-button"
                disabled={!selectedSlots[item.id]}
                onClick={() => setNotices((current) => ({ ...current, [item.id]: "Permintaan sewa tersimpan pada sesi ini. Belum ada transaksi yang dibuat." }))}
                type="button"
              >
                Kirim permintaan sewa
              </button>
              {notices[item.id] && <p className="market-notice" role="status">{notices[item.id]}</p>}
            </div>
          </article>
        ) : (
          <article className="product-card" key={item.id}>
            <figure><img alt="" src={item.image} /><figcaption>Foto: {item.credit}</figcaption></figure>
            <div>
              <span className="eyebrow">Produk karya</span>
              <h2>{item.title}</h2>
              <strong>{item.discipline} · {item.location}</strong>
              <p>{item.description}</p>
              <div className="product-buy">
                <div><small>Harga</small><b>{formatPrice(item.price)}</b><span>Stok: {item.stock}</span></div>
                <label>
                  <span className="sr-only">Jumlah produk</span>
                  <input
                    max={item.stock}
                    min={1}
                    onChange={(event) => setQuantities((current) => ({ ...current, [item.id]: Number(event.target.value) }))}
                    type="number"
                    value={quantities[item.id] ?? 1}
                  />
                </label>
                <button className="primary-button" onClick={() => setNotices((current) => ({ ...current, [item.id]: "Pesanan produk tersimpan pada sesi ini. Belum ada transaksi yang dibuat." }))} type="button">
                  Pesan produk
                </button>
              </div>
              {notices[item.id] && <p className="market-notice" role="status">{notices[item.id]}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

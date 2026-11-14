import { useState } from "react";
import { DataState } from "@/components/DataState";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { ServiceBooking, type BookingResult } from "@/components/ServiceBooking";
import { api, type Listing, type Slot } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { eyebrow, pageWrap, primaryButton, secondaryButton } from "@/lib/ui";

const figureClass = "relative m-0 h-full min-h-[260px] max-[600px]:min-h-[220px]";
const captionClass = "absolute right-2 bottom-2 bg-ink px-[7px] py-[5px] text-[8px] text-white";
const metaClass = "text-[11px] text-brick-dark";
const descriptionClass = "my-3.5 text-xs leading-[1.7] text-muted";
const sectionHeadingClass = "mt-[5px] mb-0 font-serif text-[clamp(30px,3.5vw,46px)]";

export function ServicesPage({ onCreate }: { onCreate: () => void }) {
  const { requireLogin } = useAuth();
  const listings = useResource((signal) => api<Listing[]>("/listings", { signal }), []);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);

  const services = listings.data?.filter((item) => item.kind === "service") ?? [];
  const products = listings.data?.filter((item) => item.kind === "product") ?? [];

  async function bookService(item: Listing, date: string, time: string): Promise<BookingResult> {
    if (!requireLogin()) return { ok: false, message: "Silakan masuk terlebih dahulu untuk menyewa jasa." };
    setBusy(item.id);
    try {
      const result = await api<{ slot: Slot }>(`/listings/${item.id}/bookings`, {
        method: "POST",
        body: { date, time },
      });
      listings.setData((current) => (current ?? []).map((listing) => (
        listing.id === item.id
          ? {
              ...listing,
              slots: [...(listing.slots ?? []).filter((slot) => slot.id !== result.slot.id), result.slot],
            }
          : listing
      )));
      return {
        ok: true,
        message: `Jadwal ${date} pukul ${time} tersimpan dan kini diblok untuk pengguna lain.`,
      };
    } catch (caught) {
      return {
        ok: false,
        message: caught instanceof Error ? caught.message : "Permintaan sewa belum tersimpan.",
      };
    } finally {
      setBusy(null);
    }
  }

  async function orderProduct(item: Listing) {
    if (!requireLogin()) return;
    const quantity = quantities[item.id] ?? 1;
    setBusy(item.id);
    setNotices((current) => ({ ...current, [item.id]: "" }));
    try {
      const result = await api<{ stock: number }>(`/listings/${item.id}/orders`, { method: "POST", body: { quantity } });
      listings.setData((current) => (current ?? []).map((listing) => (
        listing.id === item.id ? { ...listing, stock: result.stock } : listing
      )));
      setNotices((current) => ({ ...current, [item.id]: "Pesanan produk tersimpan." }));
    } catch (caught) {
      setNotices((current) => ({ ...current, [item.id]: caught instanceof Error ? caught.message : "Pesanan belum tersimpan." }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={pageWrap}>
      <PageHeader
        action={<button className={primaryButton} onClick={onCreate} type="button"><Icon name="plus" /> Tawarkan jasa</button>}
        eyebrow="Marketplace seni budaya"
        text="Temukan keahlian, pilih jadwal pertunjukan, atau beli karya langsung dari pelaku budaya."
        title="Sewa keahlian atau bawa pulang karya."
      />

      {listings.state === "loading" && <DataState icon="briefcase" text="Jasa dan produk sedang diambil dari server." title="Memuat marketplace" />}
      {listings.state === "error" && (
        <DataState
          action={<button className={secondaryButton()} onClick={listings.reload} type="button">Muat ulang etalase</button>}
          alert
          icon="close"
          text={listings.error}
          title="Etalase tidak dapat dimuat"
        />
      )}

      {listings.state === "ready" && (
        <>
          <section className="mb-[58px]">
            <div className="mb-6">
              <span className={eyebrow}>Penyewaan jasa</span>
              <h2 className={sectionHeadingClass}>Jasa</h2>
              <p className="mt-2 mb-0 max-w-[640px] text-xs leading-[1.7] text-muted">
                Klik "Pilih jadwal &amp; sewa" untuk membuka kalender. Jadwal yang sudah dipesan otomatis diblok.
              </p>
            </div>
            {services.length === 0 ? (
              <DataState icon="briefcase" text="Belum ada jasa yang ditawarkan." title="Belum ada jasa" />
            ) : (
              <div className="grid gap-6">
                {services.map((item) => (
                  <article
                    className="grid grid-cols-[270px_1fr] overflow-hidden rounded-lg border border-line bg-paper max-[600px]:grid-cols-1"
                    key={item.id}
                  >
                    <figure className={figureClass}>
                      <img alt="" className="size-full object-cover saturate-[.8]" src={item.image} />
                      <figcaption className={captionClass}>Foto: {item.credit}</figcaption>
                    </figure>
                    <div className="p-8 max-[600px]:p-[24px_20px]">
                      <span className={eyebrow}>Jasa</span>
                      <h3 className="my-2 font-serif text-[29px] leading-[1.1]">{item.title}</h3>
                      <strong className={metaClass}>{item.discipline} · {item.location}</strong>
                      <p className={descriptionClass}>{item.description}</p>
                      <div className="mt-6 flex flex-wrap items-end gap-3">
                        <div className="mr-auto grid">
                          <small className="text-[9px] text-muted">Harga mulai dari</small>
                          <b className="font-serif text-[26px]">{formatPrice(Number(item.price))}</b>
                          <span className="text-[9px] text-muted">{item.unit}</span>
                        </div>
                        <ServiceBooking
                          booked={(item.slots ?? []).filter((slot) => slot.status === "booked")}
                          busy={busy === item.id}
                          onBook={(date, time) => bookService(item, date, time)}
                          title={item.title}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-6">
              <span className={eyebrow}>Etalase karya</span>
              <h2 className={sectionHeadingClass}>Produk</h2>
              <p className="mt-2 mb-0 max-w-[640px] text-xs leading-[1.7] text-muted">
                Karya siap dibawa pulang. Jumlah pesanan mengikuti stok yang tersedia.
              </p>
            </div>
            {products.length === 0 ? (
              <DataState icon="archive" text="Belum ada produk karya yang ditawarkan." title="Belum ada produk" />
            ) : (
              <div className="grid gap-6">
                {products.map((item) => (
                  <article
                    className="grid grid-cols-[270px_1fr] overflow-hidden rounded-lg border border-line bg-paper max-[600px]:grid-cols-1"
                    key={item.id}
                  >
                    <figure className={figureClass}>
                      <img alt="" className="size-full object-cover saturate-[.8]" src={item.image} />
                      <figcaption className={captionClass}>Foto: {item.credit}</figcaption>
                    </figure>
                    <div className="p-8 max-[600px]:p-[24px_20px]">
                      <span className={eyebrow}>Produk</span>
                      <h3 className="my-2 font-serif text-[29px] leading-[1.1]">{item.title}</h3>
                      <strong className={metaClass}>{item.discipline} · {item.location}</strong>
                      <p className={descriptionClass}>{item.description}</p>
                      <div className="mt-6 flex flex-wrap items-end gap-3">
                        <div className="mr-auto grid">
                          <small className="text-[9px] text-muted">Harga</small>
                          <b className="font-serif text-[26px]">{formatPrice(Number(item.price))}</b>
                          <span className="text-[9px] text-muted">Stok: {item.stock ?? 0}</span>
                        </div>
                        <label>
                          <span className="sr-only">Jumlah produk</span>
                          <input
                            className="h-[46px] w-[66px] rounded-sm border border-line bg-white px-2 text-center"
                            max={item.stock ?? 1}
                            min={1}
                            onChange={(event) => setQuantities((current) => ({ ...current, [item.id]: Number(event.target.value) }))}
                            type="number"
                            value={quantities[item.id] ?? 1}
                          />
                        </label>
                        <button className={primaryButton} disabled={busy === item.id} onClick={() => void orderProduct(item)} type="button">
                          {busy === item.id ? "Mengirim..." : "Pesan produk"}
                        </button>
                      </div>
                      {notices[item.id] && (
                        <p className="mt-3 rounded-sm bg-[#e1e8de] px-3 py-2.5 text-[10px] text-moss" role="status">{notices[item.id]}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Slot } from "@/lib/api";
import { eyebrow, iconButton, primaryButton } from "@/lib/ui";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const longDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatLongDate(value: string) {
  return longDateFormatter.format(new Date(`${value}T00:00:00`));
}

export type BookingResult = { ok: boolean; message: string };

export function ServiceBooking({
  booked,
  busy,
  onBook,
  title,
}: {
  booked: Slot[];
  busy: boolean;
  onBook: (date: string, time: string) => Promise<BookingResult>;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);
  const [month, setMonth] = useState(() => startOfMonth(today));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);

  const bookedDates = useMemo(
    () => new Set(booked.filter((slot) => /^\d{4}-\d{2}-\d{2}$/.test(slot.date)).map((slot) => slot.date)),
    [booked],
  );
  const bookedTimes = useMemo(
    () => booked.filter((slot) => slot.date === date).map((slot) => slot.time),
    [booked, date],
  );
  const conflict = Boolean(date && time && bookedTimes.includes(time));

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, index) => index + 1),
    ];
  }, [month]);

  const monthLabel = monthFormatter.format(month);
  const canGoPrev = month.getTime() > startOfMonth(today).getTime();
  const pending = busy || sending;

  function open() {
    setResult(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function pickDate(value: string) {
    setDate(value);
    setTime("");
    setResult(null);
  }

  async function submit() {
    if (!date || !time || conflict) return;
    setSending(true);
    const outcome = await onBook(date, time);
    setSending(false);
    setResult(outcome);
    if (outcome.ok) setTime("");
  }

  return (
    <>
      <button className={primaryButton} onClick={open} type="button">
        <Icon name="calendar" /> Pilih jadwal &amp; sewa
      </button>

      <dialog
        className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh_-_30px)] w-[min(560px,calc(100%_-_30px))] overflow-y-auto rounded-lg border-0 bg-paper p-0 text-ink shadow-[0_22px_70px_rgba(30,24,19,.35)] backdrop:bg-[rgba(27,22,18,.7)]"
        onCancel={close}
        ref={dialogRef}
      >
        <div className="flex items-start justify-between gap-6 border-b border-line px-7 pt-[26px] pb-5">
          <div>
            <span className={eyebrow}>Penyewaan jasa</span>
            <h2 className="m-0 font-serif text-[24px] leading-[1.15]">{title}</h2>
          </div>
          <button aria-label="Tutup dialog" className={iconButton} onClick={close} type="button">
            <Icon name="close" />
          </button>
        </div>

        {result?.ok ? (
          <div className="grid place-items-center p-[42px_30px] text-center" role="status">
            <span className="grid size-[58px] place-items-center rounded-full bg-moss text-white">
              <Icon name="check" size={28} />
            </span>
            <h3 className="mt-[18px] mb-2 font-serif text-[26px]">Permintaan terkirim</h3>
            <p className="max-w-[380px] text-xs leading-[1.7] text-muted">{result.message}</p>
            <button className={primaryButton} onClick={close} type="button">Tutup</button>
          </div>
        ) : (
          <div className="grid gap-4 p-7 max-[600px]:p-[21px]">
            <div>
              <span className={eyebrow}>Pilih tanggal</span>
              <div className="rounded-md border border-line bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <button
                    aria-label="Bulan sebelumnya"
                    className="grid size-8 cursor-pointer place-items-center rounded-sm border border-line bg-paper text-sm hover:bg-[#eee7db] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canGoPrev}
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    type="button"
                  >
                    ‹
                  </button>
                  <strong className="font-serif text-base capitalize">{monthLabel}</strong>
                  <button
                    aria-label="Bulan berikutnya"
                    className="grid size-8 cursor-pointer place-items-center rounded-sm border border-line bg-paper text-sm hover:bg-[#eee7db]"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    type="button"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-wide text-muted">
                  {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map((day, index) => {
                    if (day === null) return <span key={`blank-${index}`} />;
                    const iso = toISODate(new Date(month.getFullYear(), month.getMonth(), day));
                    const past = iso < todayISO;
                    const selected = iso === date;
                    const hasBooking = bookedDates.has(iso);
                    return (
                      <button
                        aria-label={formatLongDate(iso)}
                        aria-pressed={selected}
                        className={`relative grid aspect-square place-items-center rounded-sm border text-xs ${
                          past
                            ? "cursor-not-allowed border-transparent text-line"
                            : selected
                              ? "cursor-pointer border-brick bg-brick font-bold text-white"
                              : "cursor-pointer border-line bg-white text-ink hover:border-brick hover:text-brick"
                        }`}
                        disabled={past}
                        key={iso}
                        onClick={() => pickDate(iso)}
                        type="button"
                      >
                        {day}
                        {hasBooking && (
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-1 size-1 rounded-full ${selected ? "bg-white" : "bg-gold"}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 mb-0 text-[10px] leading-normal text-muted">
                Tanggal bertanda titik sudah punya pesanan. Jam yang sudah dipesan akan diblok.
              </p>
            </div>

            <label className="grid gap-2 text-[11px] font-bold">
              Waktu mulai
              <input
                className="h-11 w-full rounded-sm border border-line bg-white px-3 text-ink disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!date}
                max="23:00"
                min="06:00"
                onChange={(event) => {
                  setTime(event.target.value);
                  setResult(null);
                }}
                step={900}
                type="time"
                value={time}
              />
            </label>

            <p className="m-0 text-[10px] leading-normal text-muted">
              {date ? `Tanggal dipilih: ${formatLongDate(date)}` : "Pilih tanggal di kalender, lalu tentukan jam mulai."}
            </p>

            {bookedTimes.length > 0 && (
              <div className="grid gap-1.5">
                <small className="text-[9px] font-bold text-muted">Waktu yang sudah dipesan</small>
                <div className="flex flex-wrap gap-1.5">
                  {bookedTimes.map((value) => (
                    <button
                      className="cursor-not-allowed rounded-sm border border-line bg-[#e9e5df] px-2 py-1 text-[9px] font-bold text-[#8a837a] line-through"
                      disabled
                      key={value}
                      type="button"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {conflict && (
              <p className="m-0 rounded-sm bg-[#f4e3de] px-3 py-2 text-[10px] font-bold text-brick-dark" role="alert">
                Waktu {time} sudah dipesan. Pilih waktu lain.
              </p>
            )}
            {result && !result.ok && (
              <p className="m-0 rounded-sm bg-[#f4e3de] px-3 py-2 text-[10px] font-bold text-brick-dark" role="alert">
                {result.message}
              </p>
            )}

            <button
              className={`${primaryButton} w-full disabled:cursor-not-allowed disabled:opacity-45`}
              disabled={!date || !time || conflict || pending}
              onClick={() => void submit()}
              type="button"
            >
              {pending ? "Mengirim..." : "Kirim permintaan sewa"}
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

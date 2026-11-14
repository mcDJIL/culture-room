import { FormEvent, useEffect, useState, type RefObject } from "react";
import { api, type Discipline } from "@/lib/api";
import type { DialogMode } from "@/types";
import { Icon } from "@/components/Icon";
import {
  authError,
  eyebrow,
  fieldClass,
  formClass,
  iconButton,
  labelClass,
  primaryButton,
} from "@/lib/ui";

export function CreationDialog({
  dialogRef,
  errorMessage,
  mode,
  onClose,
  onSubmit,
  submitting,
  successMessage,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  errorMessage: string;
  mode: DialogMode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  successMessage: string;
}) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    api<Discipline[]>("/disciplines", { signal: controller.signal })
      .then(setDisciplines)
      .catch(() => setDisciplines([]));
    return () => controller.abort();
  }, []);

  return (
    <dialog
      className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh_-_30px)] w-[min(620px,calc(100%_-_30px))] overflow-y-auto rounded-lg border-0 bg-paper p-0 text-ink shadow-[0_22px_70px_rgba(30,24,19,.35)] backdrop:bg-[rgba(27,22,18,.7)] max-[600px]:w-[calc(100%_-_16px)]"
      onCancel={onClose}
      ref={dialogRef}
    >
      {mode && (
        <>
          <div className="flex items-start justify-between gap-6 border-b border-line px-7 pt-[26px] pb-5 max-[600px]:p-[21px]">
            <div>
              <span className={eyebrow}>Tersimpan ke akun Anda</span>
              <h2 className="m-0 font-serif text-[30px]">
                {mode === "post"
                  ? "Bagikan karya atau pemikiran"
                  : mode === "jasa"
                    ? "Susun etalase jasa"
                    : "Buka ajakan kolaborasi"}
              </h2>
            </div>
            <button aria-label="Tutup dialog" className={iconButton} onClick={onClose} type="button">
              <Icon name="close" />
            </button>
          </div>
          {successMessage ? (
            <div className="grid place-items-center p-[42px_30px] text-center" role="status">
              <span className="grid size-[58px] place-items-center rounded-full bg-moss text-white">
                <Icon name="check" size={28} />
              </span>
              <h3 className="mt-[18px] mb-2 font-serif text-[29px]">
                {mode === "post" ? "Karya terkirim" : "Draf tersimpan"}
              </h3>
              <p className="max-w-[420px] leading-[1.7] text-muted">{successMessage}</p>
              <button className={primaryButton} onClick={onClose} type="button">
                Kembali ke aplikasi
              </button>
            </div>
          ) : (
            <form className={formClass} onSubmit={onSubmit}>
              {errorMessage && <p className={authError} role="alert">{errorMessage}</p>}
              <label className={labelClass}>
                Kluster seni
                <select className={`${fieldClass} min-h-[46px]`} name="discipline" required>
                  <option value="">Pilih kluster</option>
                  {disciplines.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                {mode === "post" ? "Ceritakan karya atau gagasan Anda" : "Jelaskan kebutuhan dan konteksnya"}
                <textarea
                  className={`${fieldClass} resize-y`}
                  name="description"
                  placeholder={
                    mode === "post"
                      ? "Tuliskan proses, peran Anda, dan konteks budaya karya..."
                      : "Jelaskan bidang, bentuk kegiatan, lokasi, dan rekan yang dibutuhkan..."
                  }
                  required
                  rows={6}
                />
              </label>
              {mode !== "post" && (
                <label className={labelClass}>
                  Judul
                  <input
                    className={`${fieldClass} min-h-[46px]`}
                    name="title"
                    placeholder="Judul yang mudah dipahami"
                    required
                  />
                </label>
              )}
              <p className="m-0 text-[10px] leading-normal text-muted">
                Data dikirim ke server dan tersimpan di database Ruang Budaya.
              </p>
              <button className={primaryButton} disabled={submitting} type="submit">
                {submitting ? "Mengirim..." : mode === "post" ? "Bagikan ke jejaring" : "Simpan draf"}
              </button>
            </form>
          )}
        </>
      )}
    </dialog>
  );
}

import type { FormEvent, RefObject } from "react";
import { disciplines } from "@/data/demoData";
import type { DialogMode } from "@/types";
import { Icon } from "@/components/Icon";

export function CreationDialog({
  dialogRef,
  mode,
  onClose,
  onSubmit,
  successMessage,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  mode: DialogMode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  successMessage: string;
}) {
  return (
    <dialog className="creation-dialog" onCancel={onClose} ref={dialogRef}>
      {mode && (
        <>
          <div className="dialog-header">
            <div>
              <span className="eyebrow">Disimpan hanya dalam sesi ini</span>
              <h2>
                {mode === "post"
                  ? "Bagikan karya atau pemikiran"
                  : mode === "jasa"
                    ? "Susun etalase jasa"
                    : "Buka ajakan kolaborasi"}
              </h2>
            </div>
            <button aria-label="Tutup dialog" className="icon-button" onClick={onClose} type="button">
              <Icon name="close" />
            </button>
          </div>
          {successMessage ? (
            <div className="dialog-success" role="status">
              <span><Icon name="check" size={28} /></span>
              <h3>Draf berhasil disimpan</h3>
              <p>{successMessage}</p>
              <button className="primary-button" onClick={onClose} type="button">
                Kembali ke aplikasi
              </button>
            </div>
          ) : (
            <form className="creation-form" onSubmit={onSubmit}>
              <label>
                Kluster seni
                <select name="discipline" required>
                  <option value="">Pilih kluster</option>
                  {disciplines.map((item) => <option key={item.name}>{item.name}</option>)}
                </select>
              </label>
              <label>
                {mode === "post" ? "Ceritakan karya atau gagasan Anda" : "Jelaskan kebutuhan dan konteksnya"}
                <textarea
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
                <label>
                  Judul
                  <input name="title" placeholder="Judul yang mudah dipahami" required />
                </label>
              )}
              <p className="form-disclaimer">
                Data tidak dikirim atau disimpan permanen karena backend belum terhubung.
              </p>
              <button className="primary-button" type="submit">
                Simpan draf sesi
              </button>
            </form>
          )}
        </>
      )}
    </dialog>
  );
}

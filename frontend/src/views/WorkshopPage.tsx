import { useState } from "react";
import { DataState } from "@/components/DataState";
import { PageHeader } from "@/components/PageHeader";
import { api, type Workshop } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { eyebrow, pageWrap, secondaryButton } from "@/lib/ui";

export function WorkshopPage() {
  const [cluster, setCluster] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const workshops = useResource((signal) => {
    const query = cluster ? `?cluster=${encodeURIComponent(cluster)}` : "";
    return api<Workshop[]>(`/workshops${query}`, { signal });
  }, [cluster]);
  const clusters = useResource((signal) => api<Workshop[]>("/workshops", { signal }), []);
  const clusterOptions = [...new Set((clusters.data ?? []).map((item) => item.cluster))];

  return (
    <div className={pageWrap}>
      <PageHeader
        eyebrow="Workshop kebudayaan"
        text="Agenda dikumpulkan berdasarkan kluster agar pelajar, penikmat seni, dan pelaku lintas disiplin dapat menemukan ruang belajar yang relevan."
        title="Belajar langsung dari praktik dan komunitasnya."
      />
      <div className="mb-[26px] flex justify-end rounded-md border border-line bg-paper p-[18px] max-[600px]:justify-stretch">
        <label className="grid gap-[7px] text-[10px] font-bold max-[600px]:w-full">
          Kluster seni
          <select
            className="h-11 min-w-[260px] rounded-sm border border-ink bg-transparent px-3 max-[600px]:w-full max-[600px]:min-w-0"
            onChange={(event) => setCluster(event.target.value)}
            value={cluster}
          >
            <option value="">Semua kluster</option>
            {clusterOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {workshops.state === "loading" && <DataState icon="calendar" text="Agenda workshop sedang diambil dari server." title="Memuat workshop" />}
      {workshops.state === "error" && (
        <DataState
          action={<button className={secondaryButton()} onClick={workshops.reload} type="button">Muat ulang agenda</button>}
          alert
          icon="close"
          text={workshops.error}
          title="Workshop tidak dapat dimuat"
        />
      )}
      {workshops.state === "ready" && workshops.data?.length === 0 && (
        <DataState icon="calendar" text="Belum ada agenda untuk kluster ini." title="Agenda masih kosong" />
      )}
      <div className="grid gap-3.5">
        {workshops.data?.map((item, index) => (
          <article
            className="grid min-h-[180px] grid-cols-[100px_1fr_auto] items-center gap-7 rounded-md border border-line bg-paper p-7 max-[600px]:grid-cols-[70px_1fr] max-[600px]:gap-[18px]"
            key={item.id}
          >
            <div className="grid h-[90px] w-[78px] content-center rounded-md bg-brick text-center text-white max-[600px]:h-[76px] max-[600px]:w-16">
              <span className="text-[9px]">Agenda</span>
              <strong className="font-serif text-[30px]">0{index + 1}</strong>
            </div>
            <div>
              <span className={eyebrow}>{item.cluster} · {item.format}</span>
              <h2 className="mt-2 mb-2.5 font-serif text-[30px]">{item.title}</h2>
              <p className="m-0 text-xs leading-[1.65] text-muted">{item.description}</p>
            </div>
            <button
              className={`${secondaryButton()} max-[600px]:col-span-full`}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
              type="button"
            >
              {selected === item.id ? "Tutup informasi" : "Periksa informasi"}
            </button>
            {selected === item.id && (
              <div className="col-[2/-1] rounded-sm bg-[#e4dbcd] p-[18px] text-[11px] leading-normal text-muted max-[600px]:col-span-full">
                {item.description} Format: {item.format}. Pendaftaran mengikuti penyelenggara yang terhubung ke database.
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

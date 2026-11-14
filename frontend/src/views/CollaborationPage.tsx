import { DataState } from "@/components/DataState";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { api, type Collaboration } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { eyebrow, pageWrap, primaryButton, secondaryButton } from "@/lib/ui";

export function CollaborationPage({ onCreate }: { onCreate: () => void }) {
  const { requireLogin, status } = useAuth();
  const collaborations = useResource((signal) => api<Collaboration[]>("/collaborations", { signal }), [status]);

  async function toggleInterest(item: Collaboration) {
    if (!requireLogin() || !collaborations.data) return;
    const active = !item.joined;
    collaborations.setData(collaborations.data.map((entry) => (entry.id === item.id ? { ...entry, joined: active } : entry)));
    try {
      await api(`/collaborations/${item.id}/interest`, { method: "PUT", body: { active } });
    } catch {
      collaborations.setData(collaborations.data);
    }
  }

  return (
    <div className={pageWrap}>
      <PageHeader
        action={<button className={primaryButton} onClick={onCreate} type="button"><Icon name="plus" /> Buka proyek kolaborasi</button>}
        eyebrow="Ruang perkembangan budaya"
        text="Seniman dapat menguji bentuk baru, mencari disiplin pelengkap, dan tetap mencatat sumber pengetahuan serta kontribusi setiap pihak."
        title="Gagasan baru tumbuh dari pertemuan lintas praktik."
      />
      <div className="mt-[-15px] mb-[45px] ml-auto max-w-[650px] rounded-md bg-moss p-6 text-white max-[600px]:ml-0">
        <p className="m-0 leading-[1.75]">
          Fitur ini bukan sekadar papan lowongan. Setiap proyek dirancang memiliki konteks budaya, pertanyaan artistik, kebutuhan rekan, dan catatan atribusi.
        </p>
      </div>
      {collaborations.state === "loading" && <DataState icon="users" text="Proyek kolaborasi sedang diambil dari server." title="Memuat kolaborasi" />}
      {collaborations.state === "error" && (
        <DataState
          action={<button className={secondaryButton()} onClick={collaborations.reload} type="button">Muat ulang daftar</button>}
          alert
          icon="close"
          text={collaborations.error}
          title="Kolaborasi tidak dapat dimuat"
        />
      )}
      {collaborations.state === "ready" && collaborations.data?.length === 0 && (
        <DataState
          action={<button className={primaryButton} onClick={onCreate} type="button">Buka proyek pertama</button>}
          icon="users"
          text="Belum ada ajakan kolaborasi yang dipublikasikan."
          title="Belum ada proyek terbuka"
        />
      )}
      <div className="grid gap-3.5">
        {collaborations.data?.map((item, index) => (
          <article
            className="grid min-h-[190px] grid-cols-[90px_1fr_auto] items-center gap-[30px] rounded-md border border-line bg-paper p-7 max-[820px]:grid-cols-[60px_1fr] max-[600px]:grid-cols-1 max-[600px]:gap-3.5"
            key={item.id}
          >
            <span className="font-serif text-[43px] text-brick">0{index + 1}</span>
            <div>
              <span className={eyebrow}>{item.field} · Gagasan terbuka</span>
              <h2 className="mt-2 mb-2.5 font-serif text-[30px]">{item.title}</h2>
              <p className="m-0 text-xs leading-[1.65] text-muted">{item.need}</p>
            </div>
            <button
              aria-pressed={item.joined}
              className={`${secondaryButton(item.joined)} max-[820px]:col-start-2 max-[820px]:justify-self-start max-[600px]:col-start-1`}
              onClick={() => void toggleInterest(item)}
              type="button"
            >
              {item.joined ? "Minat dicatat" : "Nyatakan minat"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

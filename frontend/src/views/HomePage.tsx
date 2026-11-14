import { DataState } from "@/components/DataState";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import { api, type Opportunity, type Post, type Workshop } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { avatar, eyebrow, primaryButton, secondaryButton, surfaceCard, textAction } from "@/lib/ui";
import type { DialogMode, View } from "@/types";

export function HomePage({
  feedVersion,
  navigate,
  onOpenDialog,
}: {
  feedVersion: number;
  navigate: (view: View) => void;
  onOpenDialog: (mode: Exclude<DialogMode, null>) => void;
}) {
  const { requireLogin, status, user } = useAuth();
  const posts = useResource((signal) => api<Post[]>("/posts", { signal }), [status, feedVersion]);
  const opportunities = useResource((signal) => api<Opportunity[]>("/opportunities", { signal }), []);
  const workshops = useResource((signal) => api<Workshop[]>("/workshops", { signal }), []);
  const displayName = user?.name || "Tamu";
  const signedIn = status === "signed-in";
  const openProfile = () => {
    if (requireLogin()) navigate("karya");
  };

  async function togglePost(id: number, field: "liked" | "saved", path: "like" | "save") {
    if (!requireLogin() || !posts.data) return;
    const current = posts.data.find((item) => item.id === id);
    if (!current) return;
    const active = !current[field];
    posts.setData(posts.data.map((item) => (item.id === id ? { ...item, [field]: active } : item)));
    try {
      await api(`/posts/${id}/${path}`, { method: "PUT", body: { active } });
    } catch {
      posts.setData(posts.data);
    }
  }

  return (
    <div className="grid grid-cols-[250px_minmax(0,650px)_300px] items-start justify-center gap-[22px] px-6 pt-7 pb-[100px] max-[1160px]:min-[821px]:grid-cols-[220px_minmax(0,650px)] max-[820px]:grid-cols-[minmax(0,650px)] max-[820px]:min-[601px]:px-[18px] max-[820px]:min-[601px]:pt-5 max-[600px]:px-2.5 max-[600px]:pt-3.5 max-[600px]:pb-[90px]">
      <aside className="sticky top-[116px] grid gap-[18px] max-[820px]:hidden">
        <section className={`${surfaceCard} relative overflow-hidden px-5 pb-[22px] text-center`}>
          <div className="-mx-5 h-[72px] bg-brick bg-[image:linear-gradient(45deg,transparent_44%,rgba(248,245,238,.25)_44%_49%,transparent_49%_51%,rgba(248,245,238,.25)_51%_56%,transparent_56%)] bg-[length:30px_30px]" />
          <span className="relative mx-auto -mt-[34px] mb-3 grid size-[68px] shrink-0 place-items-center rounded-full border-4 border-paper bg-moss font-serif text-[25px] font-bold text-white">{displayName.charAt(0)}</span>
          <span className="inline-flex rounded-sm bg-ink px-2 py-[5px] text-[9px] font-bold text-white">
            {status === "loading" ? "Memuat..." : signedIn ? "Akun Anda" : "Tamu"}
          </span>
          <h2 className="mt-3 mb-2 font-serif text-[22px]">
            {status === "loading" ? "Memuat profil" : signedIn ? displayName : "Belum masuk"}
          </h2>
          {status === "loading" ? (
            <div aria-hidden="true" className="grid gap-2">
              <span className="mx-auto h-3 w-36 animate-pulse rounded-sm bg-line" />
              <span className="mx-auto h-3 w-28 animate-pulse rounded-sm bg-line" />
              <span className="mt-2 h-11 w-full animate-pulse rounded-sm bg-line/60" />
            </div>
          ) : signedIn ? (
            <>
              <p className="text-[12px] leading-[1.6] text-muted">
                {user?.headline || "Tambahkan bidang seni, domisili, afiliasi sanggar, dan riwayat karya."}
              </p>
              <button className={textAction} onClick={() => navigate("karya")} type="button">
                Lengkapi portofolio
              </button>
            </>
          ) : (
            <>
              <p className="text-[12px] leading-[1.6] text-muted">
                Masuk dulu untuk membuka halaman profil, portofolio, dan karya tersimpan Anda.
              </p>
              <button className={textAction} onClick={openProfile} type="button">
                Masuk untuk membuka profil
              </button>
            </>
          )}
        </section>
        <section className={`${surfaceCard} px-4 py-2`}>
          <button className="flex min-h-12 w-full cursor-pointer items-center gap-2.5 border-b border-line bg-transparent py-[5px] text-left text-[12px] last:border-b-0" onClick={openProfile} type="button"><Icon name="archive" /> Karya tersimpan</button>
          <button className="flex min-h-12 w-full cursor-pointer items-center gap-2.5 border-b border-line bg-transparent py-[5px] text-left text-[12px] last:border-b-0" onClick={() => navigate("jejaring")} type="button"><Icon name="network" /> Kluster yang diikuti</button>
          <button className="flex min-h-12 w-full cursor-pointer items-center gap-2.5 border-b border-line bg-transparent py-[5px] text-left text-[12px] last:border-b-0" onClick={() => navigate("workshop")} type="button"><Icon name="calendar" /> Agenda workshop</button>
        </section>
      </aside>

      <section className="grid min-w-0 gap-4" aria-label="Aktivitas jejaring budaya">
        <div className={`${surfaceCard} p-[18px] max-[600px]:p-[13px]`}>
          <div className="flex items-center gap-3">
            <span className={avatar}>{displayName.charAt(0)}</span>
            <button className="w-full min-h-[46px] cursor-pointer rounded-md border border-[#897f72] bg-transparent px-4 py-2.5 text-left text-muted hover:bg-[#eee7db]" onClick={() => onOpenDialog("post")} type="button">
              Bagikan karya, proses, atau gagasan pengembangan seni
            </button>
          </div>
          <div className="mt-[13px] grid grid-cols-[repeat(3,1fr)] gap-1.5">
            <button className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm bg-transparent p-2 text-[11px] font-bold hover:bg-[#eee7db] hover:text-brick max-[600px]:flex-col max-[600px]:gap-[5px] max-[600px]:text-[9px]" onClick={() => onOpenDialog("post")} type="button"><Icon name="image" /> Unggah karya</button>
            <button className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm bg-transparent p-2 text-[11px] font-bold hover:bg-[#eee7db] hover:text-brick max-[600px]:flex-col max-[600px]:gap-[5px] max-[600px]:text-[9px]" onClick={() => onOpenDialog("kolaborasi")} type="button"><Icon name="users" /> Cari kolaborator</button>
            <button className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm bg-transparent p-2 text-[11px] font-bold hover:bg-[#eee7db] hover:text-brick max-[600px]:flex-col max-[600px]:gap-[5px] max-[600px]:text-[9px]" onClick={() => onOpenDialog("jasa")} type="button"><Icon name="briefcase" /> Tawarkan jasa</button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-[18px] px-0.5 pt-3 pb-0.5 max-[600px]:flex-col max-[600px]:items-start">
          <div>
            <span className={eyebrow}>Beranda jejaring</span>
            <h1 className="mt-1 max-w-[500px] font-serif text-[28px] leading-[1.08] max-[600px]:text-[25px]">Karya, peluang, dan percakapan komunitas</h1>
          </div>
        </div>

        {posts.state === "loading" && (
          <DataState icon="archive" text="Karya, peluang jasa, dan percakapan komunitas sedang diambil dari server." title="Memuat aktivitas jejaring" />
        )}
        {posts.state === "error" && (
          <DataState
            action={<button className={secondaryButton()} onClick={posts.reload} type="button">Muat ulang aktivitas</button>}
            alert
            icon="close"
            text={posts.error}
            title="Aktivitas tidak dapat dimuat"
          />
        )}
        {posts.state === "ready" && posts.data?.length === 0 && (
          <DataState
            action={<button className={primaryButton} onClick={() => onOpenDialog("post")} type="button">Bagikan karya pertama</button>}
            icon="image"
            text="Ikuti kluster seni atau bagikan karya pertama agar percakapan muncul di sini."
            title="Belum ada aktivitas di beranda Anda"
          />
        )}
        {posts.state === "ready" && posts.data?.map((post) => (
          <PostCard
            key={post.id}
            onLike={() => void togglePost(post.id, "liked", "like")}
            onSave={() => void togglePost(post.id, "saved", "save")}
            post={post}
          />
        ))}
      </section>

      <aside className="sticky top-[116px] grid gap-[18px] max-[1160px]:hidden">
        <section className={`${surfaceCard} p-5`}>
          <div>
            <span className={eyebrow}>Peluang jasa</span>
            <h2 className="mb-[18px] font-serif text-[21px] leading-[1.15]">Kebutuhan dari pencari seniman</h2>
          </div>
          {opportunities.data?.map((item) => (
            <Opportunity detail={item.detail} key={item.id} title={item.title} />
          ))}
          <button className={textAction} onClick={() => navigate("jasa")} type="button">Buka etalase jasa</button>
        </section>
        <section className={`${surfaceCard} p-5`}>
          <div>
            <span className={eyebrow}>Workshop terdekat</span>
            <h2 className="mb-[18px] font-serif text-[21px] leading-[1.15]">Belajar berdasarkan kluster</h2>
          </div>
          {workshops.data?.slice(0, 2).map((item) => (
            <button className="flex min-h-16 w-full cursor-pointer items-start gap-2.5 rounded-sm border-t border-line bg-transparent px-2 py-3 text-left hover:bg-[#eee7db]" key={item.id} onClick={() => navigate("workshop")} type="button">
              <Icon name="calendar" />
              <span className="grid gap-[5px]"><strong className="text-[10px] leading-[1.4]">{item.title}</strong><small className="text-[9px] text-muted">{item.cluster}</small></span>
            </button>
          ))}
          <button className={textAction} onClick={() => navigate("workshop")} type="button">Lihat semua workshop</button>
        </section>
      </aside>
    </div>
  );
}

function Opportunity({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="flex items-start gap-[11px] border-t border-line py-[13px]">
      <span className="mt-1 size-[9px] shrink-0 rounded-[3px] bg-gold" aria-hidden="true" />
      <div className="grid gap-1"><strong className="text-[11px]">{title}</strong><span className="text-[9px] text-muted">{detail}</span></div>
    </div>
  );
}

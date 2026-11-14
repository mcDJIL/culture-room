import { FormEvent, useState } from "react";
import Link from "next/link";
import { DataState } from "@/components/DataState";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import { api, type Discipline, type Post } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { cardNotice, fieldClass, formClass, labelClass, pageWrap, primaryButton, secondaryButton, surfaceCard } from "@/lib/ui";

export function PortfolioPage({ onCreate }: { onCreate: () => void }) {
  const { requireLogin, status, user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"karya" | "pengalaman" | "tentang">("karya");
  const posts = useResource(async (signal) => {
    const all = await api<Post[]>("/posts", { signal });
    return all.filter((post) => post.isOwn || (user && post.author === user.name));
  }, [status, user?.id]);
  const disciplines = useResource((signal) => api<Discipline[]>("/disciplines", { signal }), []);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireLogin()) return;
    const data = new FormData(event.currentTarget);
    setSaving(true);
    setNotice("");
    try {
      await api("/profile", {
        method: "PUT",
        body: {
          name: String(data.get("name") || "").trim(),
          headline: String(data.get("headline") || "").trim(),
          location: String(data.get("location") || "").trim() || null,
          discipline: String(data.get("discipline") || "").trim() || null,
        },
      });
      await refreshUser();
      setNotice("Profil tersimpan.");
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "Profil belum tersimpan.");
    } finally {
      setSaving(false);
    }
  }

  const displayName = user?.name || "Profil Anda";

  if (status !== "signed-in") {
    return (
      <div className={pageWrap}>
        {status === "loading" ? (
          <DataState icon="users" text="Memeriksa sesi akun Anda." title="Memuat profil" />
        ) : (
          <DataState
            action={
              <Link className={primaryButton} href="/masuk">
                Masuk ke akun
              </Link>
            }
            icon="users"
            text="Halaman profil dan portofolio hanya bisa dibuka setelah Anda masuk. Daftar dulu jika belum punya akun."
            title="Masuk untuk membuka profil"
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[75vh] w-[min(1180px,calc(100%_-_48px))] pt-[70px] pb-[120px] max-[820px]:min-[601px]:w-[min(100%_-_36px,700px)] max-[820px]:min-[601px]:pt-12 max-[600px]:w-[calc(100%_-_20px)] max-[600px]:pt-[42px] max-[600px]:pb-[90px]">
      <section className={`${surfaceCard} relative overflow-hidden`}>
        <div className="h-[230px] bg-brick bg-[image:linear-gradient(45deg,transparent_45%,rgba(248,245,238,.18)_45%_49%,transparent_49%_51%,rgba(248,245,238,.18)_51%_55%,transparent_55%)] bg-[length:55px_55px] max-[600px]:h-[150px]" />
        <div className="relative px-[34px] pt-[76px] pb-7 max-[600px]:px-5 max-[600px]:pt-[68px] max-[600px]:pb-[22px]">
          <span className="absolute -top-[62px] grid size-[124px] shrink-0 place-items-center rounded-full border-[6px] border-paper bg-moss font-serif text-[46px] font-bold text-white max-[600px]:-top-[53px] max-[600px]:size-[105px]">{displayName.charAt(0)}</span>
          <span className="inline-flex rounded-sm bg-ink px-2 py-[5px] text-[9px] font-bold text-white">
            {status === "signed-in" ? "Akun Anda" : "Tamu"}
          </span>
          <h1 className="mt-4 mb-[7px] font-serif text-[42px] max-[600px]:text-[34px]">{displayName}</h1>
          <p className="text-[12px] text-muted">
            {user?.discipline || "Bidang seni belum dipilih"} · {user?.location || "Domisili belum diisi"}
          </p>
          <p className="my-5 max-w-[650px] text-[14px] leading-[1.7] text-muted">
            {user?.headline || "Gunakan profil ini untuk mencatat proses, peran, karya, pengalaman, afiliasi sanggar, dan jasa yang dapat dipesan."}
          </p>
          <button className={primaryButton} onClick={onCreate} type="button"><Icon name="plus" /> Tambahkan karya</button>
        </div>
        <nav aria-label="Bagian profil" className="flex border-t border-line px-[26px] max-[600px]:overflow-x-auto max-[600px]:px-2">
          {(["karya", "pengalaman", "tentang"] as const).map((tab) => (
            <button aria-current={activeTab === tab ? "page" : undefined} className="min-h-[54px] cursor-pointer border-b-[3px] border-b-transparent bg-transparent px-[18px] py-2 font-bold aria-[current=page]:border-b-brick aria-[current=page]:text-brick" key={tab} onClick={() => setActiveTab(tab)} type="button">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </section>

      {activeTab === "karya" && (
        <div className="mt-[22px] grid gap-4">
          {posts.state === "loading" && <DataState icon="archive" text="Karya dari akun Anda sedang diambil dari server." title="Memuat portofolio" />}
          {posts.state === "error" && (
            <DataState
              action={<button className={secondaryButton()} onClick={posts.reload} type="button">Muat ulang karya</button>}
              alert
              icon="close"
              text={posts.error}
              title="Portofolio tidak dapat dimuat"
            />
          )}
          {posts.state === "ready" && posts.data?.length === 0 && (
            <EmptyProfile icon="archive" title="Portofolio Anda masih kosong" text="Unggah dokumentasi pertama dan jelaskan konteks karya, peran, tahun, serta pihak yang terlibat.">
              <button className={primaryButton} onClick={onCreate} type="button">Tambahkan karya pertama</button>
            </EmptyProfile>
          )}
          {posts.data?.map((post) => (
            <PostCard
              key={post.id}
              onLike={() => void togglePost(post.id, "liked", "like")}
              onSave={() => void togglePost(post.id, "saved", "save")}
              post={post}
            />
          ))}
        </div>
      )}
      {activeTab === "pengalaman" && (
        <EmptyProfile icon="briefcase" title="Belum ada pengalaman yang dicatat" text="Riwayat pertunjukan, pameran, pengajaran, dan produksi akan muncul di sini." />
      )}
      {activeTab === "tentang" && (
        <section className={`${surfaceCard} mt-[22px] p-8 max-[600px]:px-5`}>
          {status !== "signed-in" ? (
            <EmptyProfile icon="users" title="Masuk untuk melengkapi identitas" text="Tambahkan bio, bidang seni, dan domisili setelah masuk ke akun Anda." />
          ) : (
            <form className={formClass} onSubmit={(event) => void saveProfile(event)}>
              <label className={labelClass}>
                Nama
                <input className={`${fieldClass} min-h-[46px]`} defaultValue={user?.name ?? ""} name="name" required />
              </label>
              <label className={labelClass}>
                Headline
                <input className={`${fieldClass} min-h-[46px]`} defaultValue={user?.headline ?? ""} name="headline" />
              </label>
              <label className={labelClass}>
                Domisili
                <input className={`${fieldClass} min-h-[46px]`} defaultValue={user?.location ?? ""} name="location" />
              </label>
              <label className={labelClass}>
                Kluster seni
                <select className={`${fieldClass} min-h-[46px]`} defaultValue={user?.discipline ?? ""} name="discipline">
                  <option value="">Belum dipilih</option>
                  {disciplines.data?.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
              {notice && <p className={cardNotice} role="status">{notice}</p>}
              <button className={primaryButton} disabled={saving} type="submit">
                {saving ? "Menyimpan..." : "Simpan profil"}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}

function EmptyProfile({
  children,
  icon,
  text,
  title,
}: {
  children?: React.ReactNode;
  icon: "archive" | "briefcase" | "users";
  text: string;
  title: string;
}) {
  return (
    <section className={`${surfaceCard} mt-[22px] grid min-h-[330px] content-center place-items-center gap-3 p-10 text-center max-[600px]:px-5 max-[600px]:py-[30px]`}>
      <Icon name={icon} size={34} />
      <h2 className="mt-2 font-serif text-[30px]">{title}</h2>
      <p className="max-w-[520px] leading-[1.7] text-muted">{text}</p>
      {children}
    </section>
  );
}

import { useState } from "react";
import { workshops } from "@/data/demoData";
import { Icon } from "@/components/Icon";
import { PostCard } from "@/components/PostCard";
import type { DialogMode, Post, View } from "@/types";

type DemoState = "ready" | "loading" | "empty" | "error";

export function HomePage({
  liked,
  navigate,
  onLike,
  onOpenDialog,
  onSave,
  posts,
  saved,
}: {
  liked: number[];
  navigate: (view: View) => void;
  onLike: (id: number) => void;
  onOpenDialog: (mode: Exclude<DialogMode, null>) => void;
  onSave: (id: number) => void;
  posts: Post[];
  saved: number[];
}) {
  const [demoState, setDemoState] = useState<DemoState>("ready");

  return (
    <div className="app-layout">
      <aside className="left-rail">
        <section className="profile-card">
          <div className="profile-cover" />
          <span className="avatar profile-avatar">S</span>
          <span className="demo-chip">Profil Anda</span>
          <h2>Profil Seniman Anda</h2>
          <p>Tambahkan bidang seni, domisili, afiliasi sanggar, dan riwayat karya.</p>
          <button className="text-action" onClick={() => navigate("karya")} type="button">
            Lengkapi portofolio
          </button>
        </section>
        <section className="rail-card compact-links">
          <button onClick={() => navigate("karya")} type="button"><Icon name="archive" /> Karya tersimpan</button>
          <button onClick={() => navigate("jejaring")} type="button"><Icon name="network" /> Kluster yang diikuti</button>
          <button onClick={() => navigate("workshop")} type="button"><Icon name="calendar" /> Agenda workshop</button>
        </section>
      </aside>

      <section className="feed" aria-label="Aktivitas jejaring budaya">
        <div className="composer">
          <div className="composer-line">
            <span className="avatar">S</span>
            <button onClick={() => onOpenDialog("post")} type="button">
              Bagikan karya, proses, atau gagasan pengembangan seni
            </button>
          </div>
          <div className="composer-actions">
            <button onClick={() => onOpenDialog("post")} type="button"><Icon name="image" /> Unggah karya</button>
            <button onClick={() => onOpenDialog("kolaborasi")} type="button"><Icon name="users" /> Cari kolaborator</button>
            <button onClick={() => onOpenDialog("jasa")} type="button"><Icon name="briefcase" /> Tawarkan jasa</button>
          </div>
        </div>

        <div className="feed-context">
          <div>
            <span className="eyebrow">Beranda jejaring</span>
            <h1>Karya, peluang, dan percakapan komunitas</h1>
          </div>
          <label className="state-tester">
            Tampilan beranda
            <select onChange={(event) => setDemoState(event.target.value as DemoState)} value={demoState}>
              <option value="ready">Berisi</option>
              <option value="loading">Memuat</option>
              <option value="empty">Kosong</option>
              <option value="error">Gagal</option>
            </select>
          </label>
        </div>

        {demoState === "loading" && (
          <DataState icon="archive" text="Karya, peluang jasa, dan percakapan komunitas sedang disiapkan." title="Memuat aktivitas jejaring" />
        )}
        {demoState === "empty" && (
          <DataState
            action={<button className="primary-button" onClick={() => onOpenDialog("post")} type="button">Bagikan karya pertama</button>}
            icon="image"
            text="Ikuti kluster seni atau bagikan karya pertama agar percakapan muncul di sini."
            title="Belum ada aktivitas di beranda Anda"
          />
        )}
        {demoState === "error" && (
          <DataState
            action={<button className="secondary-button" onClick={() => setDemoState("ready")} type="button">Muat ulang aktivitas</button>}
            alert
            icon="close"
            text="Aktivitas belum dapat ditampilkan. Silakan muat ulang beranda."
            title="Aktivitas tidak dapat dimuat"
          />
        )}
        {demoState === "ready" && posts.map((post) => (
          <PostCard
            key={post.id}
            liked={liked.includes(post.id)}
            onCollaborate={() => onOpenDialog("kolaborasi")}
            onLike={() => onLike(post.id)}
            onSave={() => onSave(post.id)}
            post={post}
            saved={saved.includes(post.id)}
          />
        ))}
      </section>

      <aside className="right-rail">
        <section className="rail-card">
          <div className="rail-heading">
            <span className="eyebrow">Peluang jasa</span>
            <h2>Kebutuhan dari pencari seniman</h2>
          </div>
          <Opportunity title="Pengisi acara budaya" detail="Dibutuhkan · Pertunjukan" />
          <Opportunity title="Fasilitator kelas kriya" detail="Dibutuhkan · Workshop" />
          <Opportunity title="Penata musik pertunjukan" detail="Dibutuhkan · Kolaborasi" />
          <button className="text-action" onClick={() => navigate("jasa")} type="button">Buka etalase jasa</button>
        </section>
        <section className="rail-card">
          <div className="rail-heading">
            <span className="eyebrow">Workshop terdekat</span>
            <h2>Belajar berdasarkan kluster</h2>
          </div>
          {workshops.slice(0, 2).map((item) => (
            <button className="mini-agenda" key={item.title} onClick={() => navigate("workshop")} type="button">
              <Icon name="calendar" />
              <span><strong>{item.title}</strong><small>{item.cluster}</small></span>
            </button>
          ))}
          <button className="text-action" onClick={() => navigate("workshop")} type="button">Lihat semua workshop</button>
        </section>
      </aside>
    </div>
  );
}

function DataState({
  action,
  alert = false,
  icon,
  text,
  title,
}: {
  action?: React.ReactNode;
  alert?: boolean;
  icon: "archive" | "image" | "close";
  text: string;
  title: string;
}) {
  return (
    <div className="data-state-panel" role={alert ? "alert" : "status"}>
      <Icon name={icon} size={30} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

function Opportunity({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="opportunity">
      <span className="opportunity-mark" aria-hidden="true" />
      <div><strong>{title}</strong><span>{detail}</span></div>
    </div>
  );
}

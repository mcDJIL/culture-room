import { useState } from "react";
import { Icon } from "@/components/Icon";

export function PortfolioPage({ onCreate }: { onCreate: () => void }) {
  const [activeTab, setActiveTab] = useState<"karya" | "pengalaman" | "tentang">("karya");

  return (
    <div className="page-wrap profile-page">
      <section className="portfolio-hero">
        <div className="portfolio-cover" />
        <div className="portfolio-info">
          <span className="avatar portfolio-avatar">S</span>
          <span className="demo-chip">Profil Anda</span>
          <h1>Profil Seniman Anda</h1>
          <p>Bidang seni belum dipilih · Domisili belum diisi</p>
          <p className="portfolio-summary">
            Gunakan profil ini untuk mencatat proses, peran, karya, pengalaman, afiliasi sanggar, dan jasa yang dapat dipesan.
          </p>
          <button className="primary-button" onClick={onCreate} type="button"><Icon name="plus" /> Tambahkan karya</button>
        </div>
        <nav aria-label="Bagian profil" className="profile-tabs">
          {(["karya", "pengalaman", "tentang"] as const).map((tab) => (
            <button aria-current={activeTab === tab ? "page" : undefined} key={tab} onClick={() => setActiveTab(tab)} type="button">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </section>

      {activeTab === "karya" && (
        <EmptyProfile icon="archive" title="Portofolio Anda masih kosong" text="Unggah dokumentasi pertama dan jelaskan konteks karya, peran, tahun, serta pihak yang terlibat.">
          <button className="primary-button" onClick={onCreate} type="button">Tambahkan karya pertama</button>
        </EmptyProfile>
      )}
      {activeTab === "pengalaman" && (
        <EmptyProfile icon="briefcase" title="Belum ada pengalaman yang dicatat" text="Riwayat pertunjukan, pameran, pengajaran, dan produksi akan muncul di sini." />
      )}
      {activeTab === "tentang" && (
        <EmptyProfile icon="users" title="Identitas praktik belum lengkap" text="Tambahkan bio, bidang seni, domisili, bahasa, afiliasi sanggar, dan cara bekerja." />
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
    <section className="empty-profile-state">
      <Icon name={icon} size={34} />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </section>
  );
}

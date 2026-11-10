import { useState } from "react";
import { culturalOrganizations, disciplines, networkProfiles } from "@/data/demoData";
import { PageHeader } from "@/components/PageHeader";

export function NetworkPage({
  following,
  setFollowing,
}: {
  following: string[];
  setFollowing: (fields: string[]) => void;
}) {
  const [connections, setConnections] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [applyOpen, setApplyOpen] = useState<string | null>(null);
  const [application, setApplication] = useState("");
  const [notices, setNotices] = useState<Record<string, string>>({});

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Jejaring berdasarkan praktik"
        text="Temukan koneksi profesional, ikuti organisasi, dan ajukan diri untuk bergabung dengan ekosistem budaya."
        title="Bangun relasi dengan pelaku dan organisasi budaya."
      />

      <section className="network-section">
        <div className="network-heading">
          <span className="eyebrow">Orang yang dapat Anda kenal</span>
          <h2>Koneksi lintas praktik</h2>
        </div>
        <div className="people-grid">
          {networkProfiles.map((profile) => {
            const connected = connections.includes(profile.id);
            return (
              <article className="person-card" key={profile.id}>
                <figure className="profile-banner">
                  <img alt="" src={profile.banner} />
                  <figcaption>Foto: {profile.credit}</figcaption>
                </figure>
                <div className="profile-card-content">
                  <span className="avatar person-avatar">{profile.name.charAt(0)}</span>
                  <span className="example-label">Terbuka berkoneksi</span>
                  <h3>{profile.name}</h3>
                  <strong>{profile.headline}</strong>
                  <p>{profile.location}</p>
                  <div className="profile-context">
                    <span>{profile.disciplines[0]}</span>
                    <small>Terbuka untuk koneksi profesional</small>
                  </div>
                  <div className="tag-list">
                    {profile.disciplines.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <button
                    className={connected ? "secondary-button active" : "secondary-button"}
                    onClick={() => {
                      setConnections((current) => connected ? current.filter((id) => id !== profile.id) : [...current, profile.id]);
                      setNotices((current) => ({ ...current, [profile.id]: connected ? "Koneksi dibatalkan pada sesi ini." : "Permintaan koneksi tersimpan pada sesi ini." }));
                    }}
                    type="button"
                  >
                    {connected ? "Permintaan terkirim" : "Hubungkan"}
                  </button>
                  {notices[profile.id] && <small className="card-notice" role="status">{notices[profile.id]}</small>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="network-section">
        <div className="network-heading">
          <span className="eyebrow">Sanggar & instansi</span>
          <h2>Ikuti program atau ajukan diri bergabung</h2>
        </div>
        <div className="organization-grid">
          {culturalOrganizations.map((organization) => {
            const isFollowed = followed.includes(organization.id);
            return (
              <article className="organization-card" key={organization.id}>
                <figure className="organization-banner">
                  <img alt="" src={organization.banner} />
                  <figcaption>Foto: {organization.credit}</figcaption>
                </figure>
                <div className="organization-body">
                  <div className="organization-title">
                    <span>{organization.name.charAt(0)}</span>
                    <div>
                      <small>{organization.type}</small>
                      <h3>{organization.name}</h3>
                      <p>{organization.location}</p>
                    </div>
                  </div>
                  <p>{organization.description}</p>
                  <div className="organization-meta">
                    <span>{organization.disciplines[0]}</span>
                    <small>Menerima pengajuan anggota</small>
                  </div>
                  <div className="tag-list">
                    {organization.disciplines.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="organization-actions">
                    <button
                      className={isFollowed ? "secondary-button active" : "secondary-button"}
                      onClick={() => setFollowed((current) => isFollowed ? current.filter((id) => id !== organization.id) : [...current, organization.id])}
                      type="button"
                    >
                      {isFollowed ? "Mengikuti" : "Ikuti"}
                    </button>
                    <button className="primary-button" onClick={() => setApplyOpen(applyOpen === organization.id ? null : organization.id)} type="button">
                      Ajukan bergabung
                    </button>
                  </div>
                  {applyOpen === organization.id && (
                    <div className="apply-panel">
                      <label>
                        Alasan ingin bergabung
                        <textarea
                          onChange={(event) => setApplication(event.target.value)}
                          placeholder="Ceritakan praktik dan kontribusi yang ingin dibawa..."
                          value={application}
                        />
                      </label>
                      <button
                        className="primary-button"
                        onClick={() => {
                          setNotices((current) => ({ ...current, [`org-${organization.id}`]: application.trim().length < 20 ? "Tuliskan minimal 20 karakter." : "Pengajuan tersimpan pada sesi ini." }));
                          if (application.trim().length >= 20) {
                            setApplication("");
                            setApplyOpen(null);
                          }
                        }}
                        type="button"
                      >
                        Kirim pengajuan
                      </button>
                    </div>
                  )}
                  {notices[`org-${organization.id}`] && <small className="card-notice" role="status">{notices[`org-${organization.id}`]}</small>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="network-heading cluster-heading">
        <span className="eyebrow">Kluster seni</span>
        <h2>Ikuti bidang yang relevan</h2>
      </div>
      <div className="cluster-grid">
        {disciplines.map((item, index) => {
          const active = following.includes(item.name);
          return (
            <article className="cluster-card" key={item.name}>
              <figure className="cluster-visual">
                <img alt="" src={item.visual} />
                <span className="cluster-index">0{index + 1}</span>
                <figcaption>Foto: {item.credit} / Unsplash</figcaption>
              </figure>
              <div className="cluster-body">
                <h2>{item.name}</h2>
                <p>{item.note}</p>
                <button
                  aria-pressed={active}
                  className={active ? "secondary-button active" : "secondary-button"}
                  onClick={() =>
                    setFollowing(active ? following.filter((field) => field !== item.name) : [...following, item.name])
                  }
                  type="button"
                >
                  {active ? "Mengikuti" : "Ikuti bidang"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

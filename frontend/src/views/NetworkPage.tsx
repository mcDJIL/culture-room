import { useState } from "react";
import { DataState } from "@/components/DataState";
import { PageHeader } from "@/components/PageHeader";
import { api, type Discipline, type NetworkProfile, type Organization } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useResource } from "@/lib/useResource";
import { applyPanel, avatar, cardNotice, eyebrow, pageWrap, primaryButton, secondaryButton, tagList } from "@/lib/ui";

const bannerOverlay =
  "after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(20,15,10,.02),rgba(20,15,10,.28))] after:content-['']";
const bannerImage = "size-full object-cover saturate-[.72] contrast-[1.04]";
const bannerCaption =
  "absolute right-2 bottom-[7px] z-[1] rounded bg-[rgba(36,33,29,.9)] px-1.5 py-1 text-[7px] text-white";
const cardShell =
  "overflow-hidden rounded-lg border border-line bg-paper shadow-[0_10px_32px_rgba(50,39,29,.07)]";
const miniLabel =
  "inline-flex rounded-sm bg-ink px-1.5 py-1 text-[7px] font-bold text-white";
const miniTagItem = "rounded-sm border border-line px-1.5 py-1 text-[8px] text-muted";

export function NetworkPage() {
  const { requireLogin, status } = useAuth();
  const profiles = useResource((signal) => api<NetworkProfile[]>("/network/profiles", { signal }), [status]);
  const organizations = useResource((signal) => api<Organization[]>("/organizations", { signal }), [status]);
  const disciplines = useResource((signal) => api<Discipline[]>("/disciplines", { signal }), [status]);
  const [applyOpen, setApplyOpen] = useState<string | null>(null);
  const [application, setApplication] = useState("");
  const [notices, setNotices] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleConnection(profile: NetworkProfile) {
    if (!requireLogin() || !profiles.data) return;
    const active = !profile.connected;
    profiles.setData(profiles.data.map((item) => (item.id === profile.id ? { ...item, connected: active } : item)));
    try {
      await api(`/network/profiles/${profile.id}/connection`, { method: "PUT", body: { active } });
      setNotices((current) => ({ ...current, [profile.id]: active ? "Permintaan koneksi tersimpan." : "Koneksi dibatalkan." }));
    } catch (caught) {
      profiles.setData(profiles.data);
      setNotices((current) => ({ ...current, [profile.id]: caught instanceof Error ? caught.message : "Koneksi belum tersimpan." }));
    }
  }

  async function toggleFollowOrg(organization: Organization) {
    if (!requireLogin() || !organizations.data) return;
    const active = !organization.followed;
    organizations.setData(organizations.data.map((item) => (item.id === organization.id ? { ...item, followed: active } : item)));
    try {
      await api(`/organizations/${organization.id}/follow`, { method: "PUT", body: { active } });
    } catch {
      organizations.setData(organizations.data);
    }
  }

  async function submitApplication(organization: Organization) {
    if (!requireLogin()) return;
    setBusy(organization.id);
    try {
      await api(`/organizations/${organization.id}/applications`, { method: "POST", body: { reason: application } });
      setNotices((current) => ({ ...current, [`org-${organization.id}`]: "Pengajuan bergabung terkirim." }));
      setApplication("");
      setApplyOpen(null);
    } catch (caught) {
      setNotices((current) => ({
        ...current,
        [`org-${organization.id}`]: caught instanceof Error ? caught.message : "Pengajuan belum terkirim.",
      }));
    } finally {
      setBusy(null);
    }
  }

  async function toggleDiscipline(item: Discipline) {
    if (!requireLogin() || !disciplines.data) return;
    const active = !item.followed;
    disciplines.setData(disciplines.data.map((entry) => (entry.id === item.id ? { ...entry, followed: active } : entry)));
    try {
      await api(`/disciplines/${item.id}/follow`, { method: "PUT", body: { active } });
    } catch {
      disciplines.setData(disciplines.data);
    }
  }

  const loading = profiles.state === "loading" && organizations.state === "loading" && disciplines.state === "loading";
  const failed = profiles.state === "error" && organizations.state === "error" && disciplines.state === "error";

  return (
    <div className={pageWrap}>
      <PageHeader
        eyebrow="Jejaring berdasarkan praktik"
        text="Temukan koneksi profesional, ikuti organisasi, dan ajukan diri untuk bergabung dengan ekosistem budaya."
        title="Bangun relasi dengan pelaku dan organisasi budaya."
      />

      {loading && <DataState icon="network" text="Profil, organisasi, dan kluster sedang diambil dari server." title="Memuat jejaring" />}
      {failed && (
        <DataState
          action={<button className={secondaryButton()} onClick={() => { profiles.reload(); organizations.reload(); disciplines.reload(); }} type="button">Muat ulang jejaring</button>}
          alert
          icon="close"
          text={profiles.error}
          title="Jejaring tidak dapat dimuat"
        />
      )}

      {profiles.data && (
        <section className="mb-[58px]">
          <div className="mb-6">
            <span className={eyebrow}>Orang yang dapat Anda kenal</span>
            <h2 className="mt-[5px] mb-0 font-serif text-[clamp(30px,3.5vw,46px)]">Koneksi lintas praktik</h2>
          </div>
          <div className="grid grid-cols-4 gap-3.5 max-[1160px]:grid-cols-3 max-[820px]:grid-cols-2 max-[600px]:grid-cols-1">
            {profiles.data.map((profile) => (
              <article
                className={`${cardShell} transition-[transform,box-shadow] duration-[160ms] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(50,39,29,.11)]`}
                key={profile.id}
              >
                <figure className={`relative m-0 h-[88px] overflow-hidden bg-[#c9bba8] ${bannerOverlay}`}>
                  <img alt="" className={bannerImage} src={profile.banner} />
                  <figcaption className={bannerCaption}>Foto: {profile.credit}</figcaption>
                </figure>
                <div className="relative flex min-h-[246px] flex-col px-[17px] pb-[17px]">
                  <span className={`${avatar} mt-[-29px] size-[58px]! border-4 border-paper text-[21px]`}>
                    {profile.name.charAt(0)}
                  </span>
                  <span className={`${miniLabel} absolute top-[9px] right-[17px]`}>Terbuka berkoneksi</span>
                  <h3 className="mt-3 mb-[5px] font-serif text-[18px] leading-[1.12]">{profile.name}</h3>
                  <strong className="min-h-[34px] text-[10px] leading-normal text-ink">{profile.headline}</strong>
                  <p className="mt-2 mb-1 text-[11px] text-muted">{profile.location}</p>
                  <div className="mt-2 grid gap-[3px] border-y border-[#ddd4c7] py-[9px]">
                    <span className="text-[10px] font-bold text-brick-dark">{profile.disciplines[0]}</span>
                    <small className="text-[9px] text-muted">Terbuka untuk koneksi profesional</small>
                  </div>
                  <div className={`${tagList} mt-2.5 mb-2.5 gap-1`}>
                    {profile.disciplines.map((item) => <span className={miniTagItem} key={item}>{item}</span>)}
                  </div>
                  <button
                    className={`${secondaryButton(profile.connected)} mt-auto w-full`}
                    onClick={() => void toggleConnection(profile)}
                    type="button"
                  >
                    {profile.connected ? "Permintaan terkirim" : "Hubungkan"}
                  </button>
                  {notices[profile.id] && <small className={cardNotice} role="status">{notices[profile.id]}</small>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {organizations.data && (
        <section className="mb-[58px]">
          <div className="mb-6">
            <span className={eyebrow}>Sanggar & instansi</span>
            <h2 className="mt-[5px] mb-0 font-serif text-[clamp(30px,3.5vw,46px)]">Ikuti program atau ajukan diri bergabung</h2>
          </div>
          <div className="grid grid-cols-3 gap-3.5 max-[1160px]:grid-cols-2 max-[600px]:grid-cols-1">
            {organizations.data.map((organization) => (
              <article className={cardShell} key={organization.id}>
                <figure className={`relative m-0 h-28 overflow-hidden bg-[#c9bba8] ${bannerOverlay}`}>
                  <img alt="" className={bannerImage} src={organization.banner} />
                  <figcaption className={bannerCaption}>Foto: {organization.credit}</figcaption>
                </figure>
                <div className="px-[18px] pb-[18px]">
                  <div className="flex items-center gap-3.5">
                    <span className="mt-[-31px] grid size-[62px] shrink-0 place-items-center rounded-md border-4 border-paper bg-brick font-serif text-[22px] font-bold text-white">
                      {organization.name.charAt(0)}
                    </span>
                    <div className="min-w-0 pt-[11px]">
                      <small className="text-[9px] font-bold text-brick-dark">{organization.type}</small>
                      <h3 className="my-[3px] font-serif text-[17px] leading-[1.12]">{organization.name}</h3>
                      <p className="m-0 text-[10px] text-muted">{organization.location}</p>
                    </div>
                  </div>
                  <p className="mt-4 min-h-[63px] text-[11px] leading-normal text-muted">{organization.description}</p>
                  <div className="mt-3 grid gap-[3px] border-y border-[#ddd4c7] py-[9px]">
                    <span className="text-[10px] font-bold text-brick-dark">{organization.disciplines[0]}</span>
                    <small className="text-[9px] font-bold text-moss">
                      {organization.accepting ? "Menerima pengajuan anggota" : "Pengajuan ditutup"}
                    </small>
                  </div>
                  <div className={`${tagList} mt-2.5 gap-1`}>
                    {organization.disciplines.map((item) => <span className={miniTagItem} key={item}>{item}</span>)}
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-1.5 max-[600px]:grid-cols-1">
                    <button
                      className={`${secondaryButton(organization.followed)} min-h-[42px]! px-[9px]! py-2! text-[10px]!`}
                      onClick={() => void toggleFollowOrg(organization)}
                      type="button"
                    >
                      {organization.followed ? "Mengikuti" : "Ikuti"}
                    </button>
                    <button
                      className={`${primaryButton} min-h-[42px]! px-[9px]! py-2! text-[10px]!`}
                      onClick={() => {
                        if (!requireLogin()) return;
                        setApplyOpen(applyOpen === organization.id ? null : organization.id);
                      }}
                      type="button"
                    >
                      Ajukan bergabung
                    </button>
                  </div>
                  {applyOpen === organization.id && (
                    <div className={applyPanel}>
                      <label className="grid gap-2 text-[11px] font-bold">
                        Alasan ingin bergabung
                        <textarea
                          className="min-h-[105px] resize-y rounded-sm border border-line bg-white p-3"
                          onChange={(event) => setApplication(event.target.value)}
                          placeholder="Ceritakan praktik dan kontribusi yang ingin dibawa..."
                          value={application}
                        />
                      </label>
                      <button
                        className={`${primaryButton} mt-2.5`}
                        disabled={busy === organization.id}
                        onClick={() => void submitApplication(organization)}
                        type="button"
                      >
                        {busy === organization.id ? "Mengirim..." : "Kirim pengajuan"}
                      </button>
                    </div>
                  )}
                  {notices[`org-${organization.id}`] && <small className={cardNotice} role="status">{notices[`org-${organization.id}`]}</small>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {disciplines.data && (
        <>
          <div className="mt-2.5 mb-6">
            <span className={eyebrow}>Kluster seni</span>
            <h2 className="mt-[5px] mb-0 font-serif text-[clamp(30px,3.5vw,46px)]">Ikuti bidang yang relevan</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[1160px]:grid-cols-2 max-[600px]:grid-cols-1">
            {disciplines.data.map((item, index) => (
              <article className="group overflow-hidden rounded-md border border-line bg-paper" key={item.id}>
                <figure className="relative m-0 h-[118px] overflow-hidden bg-[#c7b9a7] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(25,20,15,.02),rgba(25,20,15,.48))] after:content-['']">
                  <img
                    alt=""
                    className="size-full object-cover saturate-[.76] contrast-[1.04] transition-transform duration-[180ms] group-hover:scale-[1.035]"
                    src={item.visual}
                  />
                  <span className="absolute top-2.5 left-3 z-[1] font-serif text-[25px] text-white">0{index + 1}</span>
                  <figcaption className={bannerCaption}>Foto: {item.credit}</figcaption>
                </figure>
                <div className="p-[18px]">
                  <h2 className="mb-2 font-serif text-[22px]">{item.name}</h2>
                  <p className="mb-3.5 min-h-[52px] text-[10px] leading-normal text-muted">{item.note}</p>
                  <button
                    aria-pressed={item.followed}
                    className={`${secondaryButton(item.followed)} min-h-[42px]!`}
                    onClick={() => void toggleDiscipline(item)}
                    type="button"
                  >
                    {item.followed ? "Mengikuti" : "Ikuti bidang"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

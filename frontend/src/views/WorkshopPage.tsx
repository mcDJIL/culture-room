import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { workshops } from "@/data/demoData";

export function WorkshopPage() {
  const [cluster, setCluster] = useState("Semua kluster");
  const [selected, setSelected] = useState<string | null>(null);
  const visible = cluster === "Semua kluster" ? workshops : workshops.filter((item) => item.cluster === cluster);

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Workshop kebudayaan"
        text="Agenda dikumpulkan berdasarkan kluster agar pelajar, penikmat seni, dan pelaku lintas disiplin dapat menemukan ruang belajar yang relevan."
        title="Belajar langsung dari praktik dan komunitasnya."
      />
      <div className="workshop-filter">
        <label>
          Kluster seni
          <select onChange={(event) => setCluster(event.target.value)} value={cluster}>
            <option>Semua kluster</option>
            {[...new Set(workshops.map((item) => item.cluster))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="workshop-list">
        {visible.map((item, index) => (
          <article key={item.title}>
            <div className="workshop-date"><span>Agenda</span><strong>0{index + 1}</strong></div>
            <div><span className="eyebrow">{item.cluster} · {item.format}</span><h2>{item.title}</h2><p>{item.description}</p></div>
            <button className="secondary-button" onClick={() => setSelected(selected === item.title ? null : item.title)} type="button">
              {selected === item.title ? "Tutup informasi" : "Periksa informasi"}
            </button>
            {selected === item.title && (
              <div className="workshop-detail">
                Jadwal, pengajar, kapasitas, tempat, biaya, dan pendaftaran belum tersedia karena penyelenggara nyata belum terhubung.
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

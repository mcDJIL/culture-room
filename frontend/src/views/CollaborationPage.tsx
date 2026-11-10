import { useState } from "react";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { collaborations } from "@/data/demoData";

export function CollaborationPage({ onCreate }: { onCreate: () => void }) {
  const [joined, setJoined] = useState<string[]>([]);

  return (
    <div className="page-wrap">
      <PageHeader
        action={<button className="primary-button" onClick={onCreate} type="button"><Icon name="plus" /> Buka proyek kolaborasi</button>}
        eyebrow="Ruang perkembangan budaya"
        text="Seniman dapat menguji bentuk baru, mencari disiplin pelengkap, dan tetap mencatat sumber pengetahuan serta kontribusi setiap pihak."
        title="Gagasan baru tumbuh dari pertemuan lintas praktik."
      />
      <div className="collaboration-intro">
        <p>
          Fitur ini bukan sekadar papan lowongan. Setiap proyek dirancang memiliki konteks budaya, pertanyaan artistik, kebutuhan rekan, dan catatan atribusi.
        </p>
      </div>
      <div className="collaboration-list">
        {collaborations.map((item, index) => {
          const active = joined.includes(item.title);
          return (
            <article key={item.title}>
              <span className="collab-number">0{index + 1}</span>
              <div><span className="eyebrow">{item.field} · Gagasan terbuka</span><h2>{item.title}</h2><p>{item.need}</p></div>
              <button
                aria-pressed={active}
                className={active ? "secondary-button active" : "secondary-button"}
                onClick={() => setJoined(active ? joined.filter((title) => title !== item.title) : [...joined, item.title])}
                type="button"
              >
                {active ? "Minat dicatat" : "Nyatakan minat"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

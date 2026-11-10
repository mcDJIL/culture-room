'use client'

import { FormEvent, useMemo, useRef, useState } from "react";
import { CreationDialog } from "@/components/CreationDialog";
import { CulturalBackdrop, CulturalMark, MotifRibbon } from "@/components/CulturalMotifs";
import { Icon } from "@/components/Icon";
import { NavButton } from "@/components/NavButton";
import { collaborations, disciplines, initialPosts, services, workshops } from "@/data/demoData";
import { CollaborationPage } from "@/views/CollaborationPage";
import { HomePage } from "@/views/HomePage";
import { NetworkPage } from "@/views/NetworkPage";
import { PortfolioPage } from "@/views/PortfolioPage";
import { ServicesPage } from "@/views/ServicesPage";
import { WorkshopPage } from "@/views/WorkshopPage";
import type { DialogMode, View } from "@/types";

function App() {
  const [view, setView] = useState<View>("beranda");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const navigate = (next: View) => {
    setView(next);
    setMobileMenu(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDialog = (mode: Exclude<DialogMode, null>) => {
    setDialogMode(mode);
    setSuccessMessage("");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setDialogMode(null);
  };

  const submitDialog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const description = String(data.get("description") || "").trim();

    if (dialogMode === "post" && description) {
      setPosts((current) => [
        {
          id: Date.now(),
          author: "Profil Anda",
          discipline: String(data.get("discipline") || "Bidang belum dipilih"),
          location: "Disimpan lokal",
          type: "Postingan sesi ini",
          body: description,
          tags: ["Dibagikan dari sesi ini"],
          local: true,
        },
        ...current,
      ]);
      setSuccessMessage("Postingan ditambahkan ke beranda untuk sesi ini.");
      return;
    }

    setSuccessMessage(
      dialogMode === "jasa"
        ? "Draf jasa tersimpan untuk sesi ini. Belum dipublikasikan."
        : "Draf ajakan kolaborasi tersimpan untuk sesi ini. Belum dipublikasikan.",
    );
  };

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const sources = [
      ...disciplines.map((item) => ({ type: "Kluster", title: item.name, view: "jejaring" as View })),
      ...services.map((item) => ({ type: "Jasa", title: item.title, view: "jasa" as View })),
      ...workshops.map((item) => ({ type: "Workshop", title: item.title, view: "workshop" as View })),
      ...collaborations.map((item) => ({ type: "Kolaborasi", title: item.title, view: "kolaborasi" as View })),
    ];
    return sources.filter((item) => item.title.toLowerCase().includes(term)).slice(0, 6);
  }, [query]);

  return (
    <div className="network-app">
      <CulturalBackdrop />
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>

      <header className="topbar">
        <button className="brand" onClick={() => navigate("beranda")} type="button">
          <CulturalMark type="batik" />
          <span>Ruang Budaya</span>
        </button>
        <div className="global-search">
          <Icon name="search" />
          <label className="sr-only" htmlFor="global-search">Cari seniman, jasa, workshop, atau kolaborasi</label>
          <input
            autoComplete="off"
            id="global-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari seniman, jasa, workshop, atau kolaborasi"
            type="search"
            value={query}
          />
          {query && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button key={`${result.type}-${result.title}`} onClick={() => navigate(result.view)} type="button">
                    <span>{result.type}</span>
                    <strong>{result.title}</strong>
                  </button>
                ))
              ) : (
                <p>Tidak ada hasil yang cocok. Coba kata lain.</p>
              )}
            </div>
          )}
        </div>
        <nav aria-label="Navigasi utama" className={mobileMenu ? "desktop-nav is-open" : "desktop-nav"}>
          <NavButton current={view} icon="home" label="Beranda" onClick={() => navigate("beranda")} view="beranda" />
          <NavButton current={view} icon="network" label="Jejaring" onClick={() => navigate("jejaring")} view="jejaring" />
          <NavButton current={view} icon="briefcase" label="Jasa" onClick={() => navigate("jasa")} view="jasa" />
          <NavButton current={view} icon="users" label="Kolaborasi" onClick={() => navigate("kolaborasi")} view="kolaborasi" />
        </nav>
        <button
          aria-expanded={mobileMenu}
          aria-label={mobileMenu ? "Tutup menu" : "Buka menu"}
          className="mobile-menu-button"
          onClick={() => setMobileMenu((open) => !open)}
          type="button"
        >
          <Icon name={mobileMenu ? "close" : "menu"} />
        </button>
        <button className="profile-trigger" onClick={() => navigate("karya")} type="button">
          <span className="avatar avatar-small">S</span>
          <span>Profil Anda</span>
        </button>
      </header>

      <div className="prototype-bar">
        Mode lokal aktif. Profil, unggahan, transaksi, dan pesan belum tersimpan lintas perangkat.
      </div>
      <MotifRibbon />

      <main id="main-content">
        {view === "beranda" && (
          <HomePage
            liked={liked}
            navigate={navigate}
            onLike={(id) =>
              setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
            }
            onOpenDialog={openDialog}
            onSave={(id) =>
              setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
            }
            posts={posts}
            saved={saved}
          />
        )}
        {view === "jejaring" && <NetworkPage following={following} setFollowing={setFollowing} />}
        {view === "karya" && <PortfolioPage onCreate={() => openDialog("post")} />}
        {view === "jasa" && <ServicesPage onCreate={() => openDialog("jasa")} />}
        {view === "kolaborasi" && <CollaborationPage onCreate={() => openDialog("kolaborasi")} />}
        {view === "workshop" && <WorkshopPage />}
      </main>

      <nav aria-label="Navigasi ponsel" className="bottom-nav">
        <NavButton current={view} icon="home" label="Beranda" onClick={() => navigate("beranda")} view="beranda" />
        <NavButton current={view} icon="network" label="Jejaring" onClick={() => navigate("jejaring")} view="jejaring" />
        <NavButton current={view} icon="plus" label="Kirim" onClick={() => openDialog("post")} view="karya" />
        <NavButton current={view} icon="briefcase" label="Jasa" onClick={() => navigate("jasa")} view="jasa" />
        <NavButton current={view} icon="users" label="Kolaborasi" onClick={() => navigate("kolaborasi")} view="kolaborasi" />
      </nav>

      <CreationDialog
        dialogRef={dialogRef}
        mode={dialogMode}
        onClose={closeDialog}
        onSubmit={submitDialog}
        successMessage={successMessage}
      />
    </div>
  );
}

export default App;

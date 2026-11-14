'use client'

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CreationDialog } from "@/components/CreationDialog";
import { CulturalBackdrop, MotifRibbon } from "@/components/CulturalMotifs";
import { Icon } from "@/components/Icon";
import { NavButton } from "@/components/NavButton";
import { api, type SearchResult } from "@/lib/api";
import { mobileAuthPrimary, mobileAuthSecondary, primaryButtonSmall } from "@/lib/ui";
import { CollaborationPage } from "@/views/CollaborationPage";
import { HomePage } from "@/views/HomePage";
import { NetworkPage } from "@/views/NetworkPage";
import { PortfolioPage } from "@/views/PortfolioPage";
import { ServicesPage } from "@/views/ServicesPage";
import { WorkshopPage } from "@/views/WorkshopPage";
import type { DialogMode, View } from "@/types";
import { useAuth } from "@/lib/auth";
import logo from "../assets/logo.png";
import Image from "next/image";

function App() {
  const [view, setView] = useState<View>("beranda");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedVersion, setFeedVersion] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { logout, requireLogin, status, user } = useAuth();
  const displayName = user?.name || "Profil Anda";

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      api<SearchResult[]>(`/search?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then(setSearchResults)
        .catch(() => setSearchResults([]));
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const navigate = (next: View) => {
    setView(next);
    setMobileMenu(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDialog = (mode: Exclude<DialogMode, null>) => {
    if (!requireLogin()) return;
    setDialogMode(mode);
    setSuccessMessage("");
    setDialogError("");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setDialogMode(null);
    setSubmitting(false);
  };

  const submitDialog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const description = String(data.get("description") || "").trim();
    const discipline = String(data.get("discipline") || "").trim();
    const title = String(data.get("title") || "").trim();
    setDialogError("");
    setSubmitting(true);

    try {
      if (dialogMode === "post") {
        await api("/posts", { method: "POST", body: { discipline, body: description } });
        setFeedVersion((current) => current + 1);
        setSuccessMessage("Karya muncul di beranda dan portofolio Anda.");
        return;
      }

      if (dialogMode === "jasa") {
        await api("/service-drafts", { method: "POST", body: { title, discipline, description } });
        setSuccessMessage("Draf jasa tersimpan. Belum tampil di etalase publik.");
        return;
      }

      await api("/collaboration-drafts", { method: "POST", body: { title, discipline, description } });
      setSuccessMessage("Draf ajakan kolaborasi tersimpan. Belum tampil di daftar publik.");
    } catch (caught) {
      setDialogError(caught instanceof Error ? caught.message : "Permintaan belum berhasil. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen overflow-clip">
      <CulturalBackdrop />
      <a
        className="fixed top-2 left-2 z-[200] -translate-y-[160%] bg-ink px-4 py-3 text-white focus:translate-y-0"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>

      <header className="sticky top-0 z-50 grid min-h-[72px] grid-cols-[auto_minmax(260px,430px)_1fr_auto] items-center gap-6 border-b border-line bg-[rgba(248,245,238,.98)] px-[max(24px,calc((100vw_-_1320px)/2))] max-[1160px]:grid-cols-[auto_minmax(240px,1fr)_auto] max-[1160px]:px-6 max-[820px]:grid-cols-[auto_1fr_auto_auto] max-[820px]:gap-3 max-[600px]:min-h-16 max-[600px]:grid-rows-[64px_42px] max-[600px]:px-3.5">
        <button
          className="flex min-h-12 cursor-pointer items-center gap-[9px] border-0 bg-transparent p-0 font-serif text-2xl font-bold max-[600px]:text-xl"
          onClick={() => navigate("beranda")}
          type="button"
        >
          <Image
            alt="Logo Ruang Budaya"
            className="max-[600px]:h-[27px] max-[600px]:w-[32px]"
            height={32}
            src={logo}
            width={38}
          />
          <span>Ruang Budaya</span>
        </button>
        <div className="relative flex h-11 items-center rounded-md bg-[#e5ded1] px-3.5 max-[600px]:col-span-full max-[600px]:row-start-2 max-[600px]:-mx-3.5 max-[600px]:h-[42px] max-[600px]:border-t max-[600px]:border-line max-[600px]:px-4">
          <Icon name="search" />
          <label className="sr-only" htmlFor="global-search">Cari seniman, jasa, workshop, atau kolaborasi</label>
          <input
            autoComplete="off"
            className="h-full w-full border-0 bg-transparent pl-2.5 text-[13px] text-ink outline-0"
            id="global-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari seniman, jasa, workshop, atau kolaborasi"
            type="search"
            value={query}
          />
          {query && (
            <div className="absolute top-[50px] right-0 left-0 overflow-hidden rounded-md border border-line bg-paper shadow-[0_16px_35px_rgba(48,38,28,.16)]">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    className="grid min-h-[62px] w-full cursor-pointer border-b border-line bg-transparent px-3.5 py-2.5 text-left last:border-b-0 hover:bg-[#e9e2d6]"
                    key={`${result.type}-${result.id}`}
                    onClick={() => navigate(result.view)}
                    type="button"
                  >
                    <span className="text-[10px] font-bold text-brick">{result.type}</span>
                    <strong className="text-[13px]">{result.title}</strong>
                  </button>
                ))
              ) : (
                <p className="m-0 p-[18px] text-xs text-muted">Tidak ada hasil yang cocok. Coba kata lain.</p>
              )}
            </div>
          )}
        </div>
        <nav
          aria-label="Navigasi utama"
          className={`flex h-[72px] items-stretch justify-end max-[820px]:absolute max-[820px]:top-[72px] max-[820px]:right-0 max-[820px]:left-0 max-[820px]:h-auto max-[820px]:border-b max-[820px]:border-line max-[820px]:bg-paper max-[820px]:px-5 max-[820px]:pt-3 max-[820px]:pb-[18px] max-[600px]:hidden ${
            mobileMenu ? "max-[820px]:grid max-[820px]:grid-cols-4" : "max-[820px]:hidden"
          }`}
        >
          <NavButton current={view} icon="home" label="Beranda" onClick={() => navigate("beranda")} view="beranda" />
          <NavButton current={view} icon="network" label="Jejaring" onClick={() => navigate("jejaring")} view="jejaring" />
          <NavButton current={view} icon="briefcase" label="Jasa" onClick={() => navigate("jasa")} view="jasa" />
          <NavButton current={view} icon="users" label="Kolaborasi" onClick={() => navigate("kolaborasi")} view="kolaborasi" />
          <div className="hidden max-[820px]:col-span-full max-[820px]:grid max-[820px]:grid-cols-2 max-[820px]:gap-2 max-[820px]:border-t max-[820px]:border-line max-[820px]:pt-3">
            {status === "signed-in" && (
              <>
                <button
                  className={mobileAuthSecondary}
                  onClick={() => navigate("karya")}
                  type="button"
                >
                  {displayName}
                </button>
                <button
                  className={mobileAuthPrimary}
                  onClick={() => void logout()}
                  type="button"
                >
                  Keluar
                </button>
              </>
            )}
            {status === "guest" && (
              <>
                <Link className={mobileAuthSecondary} href="/masuk">Masuk</Link>
                <Link className={mobileAuthPrimary} href="/daftar">Daftar</Link>
              </>
            )}
          </div>
        </nav>
        <button
          aria-expanded={mobileMenu}
          aria-label={mobileMenu ? "Tutup menu" : "Buka menu"}
          className="hidden size-11 cursor-pointer place-items-center border-0 bg-transparent max-[820px]:grid max-[600px]:hidden"
          onClick={() => setMobileMenu((open) => !open)}
          type="button"
        >
          <Icon name={mobileMenu ? "close" : "menu"} />
        </button>
        {status === "signed-in" && (
          <div className="flex items-center justify-self-end gap-2">
            <button
              className="flex min-h-12 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[11px] max-[820px]:hidden"
              onClick={() => navigate("karya")}
              type="button"
            >
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-moss font-serif font-bold text-white">
                {displayName.charAt(0)}
              </span>
              <span className="max-[1160px]:hidden">{displayName}</span>
            </button>
            <button
              className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent px-2.5 text-xs font-bold text-ink no-underline hover:text-brick"
              onClick={() => void logout()}
              type="button"
            >
              Keluar
            </button>
          </div>
        )}
        {status === "guest" && (
          <div className="flex items-center justify-self-end gap-2">
            <Link
              className="inline-flex min-h-11 items-center border-0 bg-transparent px-2.5 text-xs font-bold text-ink no-underline hover:text-brick"
              href="/masuk"
            >
              Masuk
            </Link>
            <Link
              className={primaryButtonSmall}
              href="/daftar"
            >
              Daftar
            </Link>
          </div>
        )}
      </header>

      <div className="relative z-[2] bg-brick-dark px-5 py-2 text-center text-[11px] leading-normal text-[#f9f5ed] max-[600px]:px-3.5 max-[600px]:py-[7px] max-[600px]:text-[9px]">
        Terhubung ke server Ruang Budaya. Unggahan, koneksi, dan transaksi tersimpan di database.
      </div>
      <MotifRibbon />

      <main className="relative z-[1]" id="main-content">
        {view === "beranda" && (
          <HomePage
            feedVersion={feedVersion}
            navigate={navigate}
            onOpenDialog={openDialog}
          />
        )}
        {view === "jejaring" && <NetworkPage />}
        {view === "karya" && <PortfolioPage onCreate={() => openDialog("post")} />}
        {view === "jasa" && <ServicesPage onCreate={() => openDialog("jasa")} />}
        {view === "kolaborasi" && <CollaborationPage onCreate={() => openDialog("kolaborasi")} />}
        {view === "workshop" && <WorkshopPage />}
      </main>

      <nav
        aria-label="Navigasi ponsel"
        className="hidden max-[600px]:fixed max-[600px]:right-0 max-[600px]:bottom-0 max-[600px]:left-0 max-[600px]:z-[60] max-[600px]:grid max-[600px]:grid-cols-5 max-[600px]:border-t max-[600px]:border-line max-[600px]:bg-paper max-[600px]:pb-[env(safe-area-inset-bottom)]"
      >
        <NavButton current={view} icon="home" label="Beranda" onClick={() => navigate("beranda")} view="beranda" />
        <NavButton current={view} icon="network" label="Jejaring" onClick={() => navigate("jejaring")} view="jejaring" />
        <NavButton current={view} icon="plus" label="Kirim" onClick={() => openDialog("post")} view="karya" />
        <NavButton current={view} icon="briefcase" label="Jasa" onClick={() => navigate("jasa")} view="jasa" />
        <NavButton current={view} icon="users" label="Kolaborasi" onClick={() => navigate("kolaborasi")} view="kolaborasi" />
      </nav>

      <CreationDialog
        dialogRef={dialogRef}
        errorMessage={dialogError}
        mode={dialogMode}
        onClose={closeDialog}
        onSubmit={(event) => void submitDialog(event)}
        submitting={submitting}
        successMessage={successMessage}
      />
    </div>
  );
}

export default App;

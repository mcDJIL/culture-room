"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { authError, authPage, fieldClass, formClass, labelClass, primaryButton, textAction } from "@/lib/ui";

export default function MasukPage() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "signed-in") router.replace("/");
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);
    try {
      await login(String(data.get("email") || "").trim(), String(data.get("password") || ""));
      router.push("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Permintaan belum berhasil. Silakan coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <main className={authPage}>
      <Link className={`${textAction} mb-[18px] no-underline`} href="/">Kembali ke beranda</Link>
      <PageHeader
        eyebrow="Akun Ruang Budaya"
        text="Masuk untuk menyukai, menyimpan, menanggapi, dan mengirim permintaan dari akun Anda."
        title="Masuk ke ruang budaya Anda."
      />
      <section className="rounded-lg border border-line bg-paper">
        <form className={formClass} onSubmit={handleSubmit}>
          {error && <p className={authError} role="alert">{error}</p>}
          <label className={labelClass}>
            Email
            <input autoComplete="email" className={`${fieldClass} min-h-[46px]`} name="email" required type="email" />
          </label>
          <label className={labelClass}>
            Kata sandi
            <input autoComplete="current-password" className={`${fieldClass} min-h-[46px]`} name="password" required type="password" />
          </label>
          <button className={`${primaryButton} w-full`} disabled={submitting} type="submit">
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <p className="m-0 px-7 pb-7 text-xs text-muted">
          Belum punya akun? <Link className="font-bold text-brick-dark" href="/daftar">Daftar sekarang</Link>
        </p>
      </section>
    </main>
  );
}

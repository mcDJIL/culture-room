"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { authError, authPage, fieldClass, formClass, labelClass, primaryButton, textAction } from "@/lib/ui";

export default function DaftarPage() {
  const router = useRouter();
  const { register, status } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "signed-in") router.replace("/");
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");

    if (password !== confirm) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
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
        text="Buat akun untuk membangun jejaring, mengajukan jasa, dan membuka ajakan kolaborasi."
        title="Daftar dan mulai berjejaring."
      />
      <section className="rounded-lg border border-line bg-paper">
        <form className={formClass} onSubmit={handleSubmit}>
          {error && <p className={authError} role="alert">{error}</p>}
          <label className={labelClass}>
            Nama lengkap
            <input autoComplete="name" className={`${fieldClass} min-h-[46px]`} maxLength={80} minLength={2} name="name" required />
          </label>
          <label className={labelClass}>
            Email
            <input autoComplete="email" className={`${fieldClass} min-h-[46px]`} name="email" required type="email" />
          </label>
          <label className={labelClass}>
            Kata sandi
            <input
              autoComplete="new-password"
              className={`${fieldClass} min-h-[46px]`}
              maxLength={128}
              minLength={8}
              name="password"
              placeholder="Minimal 8 karakter"
              required
              type="password"
            />
          </label>
          <label className={labelClass}>
            Ulangi kata sandi
            <input autoComplete="new-password" className={`${fieldClass} min-h-[46px]`} maxLength={128} minLength={8} name="confirm" required type="password" />
          </label>
          <button className={`${primaryButton} w-full`} disabled={submitting} type="submit">
            {submitting ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="m-0 px-7 pb-7 text-xs text-muted">
          Sudah punya akun? <Link className="font-bold text-brick-dark" href="/masuk">Masuk</Link>
        </p>
      </section>
    </main>
  );
}

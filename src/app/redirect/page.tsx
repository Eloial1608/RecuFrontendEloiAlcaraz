"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="glass-page flex min-h-screen items-center justify-center px-6 text-slate-800">
      <section className="glass-panel w-full max-w-sm rounded-3xl p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-cyan-300 shadow-lg shadow-slate-900/20">
          BN
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Banca Nova</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Preparing your session</h1>
        <p className="mt-2 text-slate-600">Un moment, t&apos;estem redirigint.</p>
        <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-slate-900/10" aria-hidden="true">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
        </div>
      </section>
    </main>
  );
}

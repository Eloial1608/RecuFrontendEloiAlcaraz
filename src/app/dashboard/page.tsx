"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/vertical/user/infrastructure/getUsers";
import { useUser } from "@/vertical/user";
import { AccountPanel } from "@/vertical/account";

type Language = "ca" | "es" | "en";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthReady, logout } = useUser();
  const [userName, setUserName] = useState("Your accounts");
  const [language, setLanguage] = useState<Language>("en");
  const pageText = {
    en: { overview: "Overview", title: "Your accounts", profile: "Profile", logout: "Log out" },
    ca: { overview: "Resum", title: "Els teus comptes", profile: "Perfil", logout: "Tancar sessió" },
    es: { overview: "Resumen", title: "Tus cuentas", profile: "Perfil", logout: "Cerrar sesión" },
  }[language];

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) router.replace("/");
  }, [isAuthReady, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    void getMe().then((user) => {
      setUserName(user.name || user.username || "Your accounts");
    }).catch(() => {
      setUserName("Your accounts");
    });
  }, [isAuthenticated]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  if (!isAuthReady || !isAuthenticated) {
    return <main className="glass-page flex min-h-screen items-center justify-center text-slate-700">Checking your session...</main>;
  }

  return (
    <main className="glass-page min-h-screen px-4 py-6 text-slate-800 sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-cyan-300/20 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Banca Nova</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{userName}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="language-select">Language</label>
          <select
            id="language-select"
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="glass-input rounded-xl border px-3 py-2.5 text-sm font-semibold text-slate-100"
          >
            <option value="ca">Català</option>
            <option value="es">Castellano</option>
            <option value="en">English</option>
          </select>
          <button type="button" onClick={() => router.push("/profile")} className="rounded-xl border border-cyan-300/40 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            {pageText.profile}
          </button>
          <button type="button" onClick={() => { logout(); router.replace("/"); }} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white">
            {pageText.logout}
          </button>
        </div>
      </header>
      <section className="glass-panel mx-auto mt-8 max-w-6xl rounded-3xl p-6 sm:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">{pageText.overview}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">{pageText.title}</h1>
        </div>
        <AccountPanel language={language} />
      </section>
    </main>
  );
}

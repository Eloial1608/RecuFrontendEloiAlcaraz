"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserLoginForm, UserRegistrationForm } from "@/vertical/user";

export default function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const router = useRouter();

  return (
    <main className="glass-page min-h-screen px-5 pb-10 pt-5 text-slate-800 sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="brand-mark" aria-hidden="true">BN</div>
          <span className="hidden text-sm font-semibold tracking-[0.18em] text-slate-800 sm:inline">BANCA NOVA</span>
        </div>
        <nav className="auth-nav" aria-label="Authentication navigation">
          <button
            type="button"
            onClick={() => setShowRegistration(false)}
            className={`auth-nav-button ${!showRegistration ? "auth-nav-button-active" : ""}`}
            aria-current={!showRegistration ? "page" : undefined}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setShowRegistration(true)}
            className={`auth-nav-button ${showRegistration ? "auth-nav-button-active" : ""}`}
            aria-current={showRegistration ? "page" : undefined}
          >
            Register
          </button>
        </nav>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,540px)] lg:gap-20 lg:py-16">
        <section className="auth-intro max-w-xl">
          <p className="eyebrow">Your banking, closer to you</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-7xl">
            A clearer way to move your money.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-slate-700">
            Manage your daily finances with a secure, simple experience designed for you.
          </p>
          <div className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-700">
            <span className="status-dot" aria-hidden="true" />
            Secure and protected access
          </div>
        </section>

        <div className="w-full">
          {!showRegistration ? (
            <UserLoginForm onRegister={() => setShowRegistration(true)} onLogin={() => router.push("/redirect")} />
          ) : (
            <UserRegistrationForm onCancel={() => setShowRegistration(false)} />
          )}
        </div>
      </div>
    </main>
  );
}

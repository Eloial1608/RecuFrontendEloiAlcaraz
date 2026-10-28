"use client";

import { useState, type FormEvent } from "react";
import { useUser } from "../hooks/useUser";

export function UserLoginForm({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isSubmitting, success, error, loginUser } = useUser();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await loginUser(email, password)) onLogin();
  }

  return (
    <section className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Banca Nova</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-slate-600">Access your account with your email and password.</p>
      </div>
      {success ? <p className="mb-5 rounded-xl border border-emerald-600/40 bg-emerald-500/10 p-3 text-emerald-800">Signed in successfully.</p> : null}
      {error ? <p role="alert" className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-800">{error}</p> : null}
      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="text-sm text-slate-700">
          Email
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
        </label>
        <label className="text-sm text-slate-700">
          Password
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
        </label>
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <button type="button" onClick={onRegister} className="mt-5 text-sm font-medium text-teal-800 underline underline-offset-4 hover:text-teal-600">
        Create a new user
      </button>
    </section>
  );
}

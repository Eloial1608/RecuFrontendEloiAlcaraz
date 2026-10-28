"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Type, type User } from "../domain/User";
import { useUser } from "../hooks/useUser";

const initialForm: User = {
  name: "", username: "", email: "", password: "", isAdmin: false,
  identityDocType: Type.DNI, identityDocNumber: "", companyName: "", phoneNumber: "",
  birthDate: "", address: "", city: "", zipCode: "",
};

function FormContent({ onCancel }: { onCancel: () => void }) {
  const [form, setForm] = useState<User>(initialForm);
  const { isSubmitting, success, error, registerUser } = useUser();

  const passwordValue = form.password ?? "";

  const passwordRequirements = useMemo(
    () => [
      { label: "Mínim 8 caràcters", valid: passwordValue.length >= 8 },
      { label: "Una majúscula", valid: /[A-Z]/.test(passwordValue) },
      { label: "Una minúscula", valid: /[a-z]/.test(passwordValue) },
      { label: "Un número", valid: /\d/.test(passwordValue) },
      { label: "Un símbol", valid: /[^A-Za-z0-9]/.test(passwordValue) },
    ],
    [passwordValue],
  );

  const isPasswordStrongEnough = passwordRequirements.every((requirement) => requirement.valid);

  function update(field: keyof User, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPasswordStrongEnough) return;
    if (await registerUser(form)) setForm(initialForm);
  }

  const fields: { key: keyof User; label: string; type?: string; required?: boolean }[] = [
    { key: "identityDocNumber", label: "Document number", required: true },
    { key: "name", label: "Full name", required: true },
    { key: "username", label: "Username", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "companyName", label: "Company name" },
    { key: "phoneNumber", label: "Phone number", type: "tel", required: true },
    { key: "birthDate", label: "Date of birth", type: "date", required: true },
    { key: "address", label: "Address", required: true },
    { key: "city", label: "City", required: true },
    { key: "zipCode", label: "Postal code", required: true },
  ];

  return (
    <section className="glass-panel w-full rounded-3xl p-6 sm:p-8">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Banca Nova</p><h1 className="mt-3 text-3xl font-semibold text-slate-900">Create user</h1><p className="mt-2 text-slate-600">Fill in the details to submit your registration.</p></div>
      {success ? <p className="mb-5 rounded-xl border border-emerald-600/40 bg-emerald-500/10 p-3 text-emerald-800">User created successfully.</p> : null}
      {error ? <p role="alert" className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-800">{error}</p> : null}
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-slate-700">Document type<select value={form.identityDocType} onChange={(event) => update("identityDocType", event.target.value)} className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"><option value={Type.DNI}>DNI</option><option value={Type.CIF}>CIF</option><option value={Type.PASSPORT}>Passport</option><option value={Type.NIE}>NIE</option></select></label>
        {fields.map(({ key, label, type = "text", required }) => <label key={key} className="text-sm text-slate-700">{label}{required ? " *" : ""}<input required={required} type={type} value={String(form[key])} onChange={(event) => update(key, event.target.value)} className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" /></label>)}
        <label className="text-sm text-slate-700 sm:col-span-2">
          Password *
          <input required type="password" value={form.password} onChange={(event) => update("password", event.target.value)} className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
        </label>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Password requirements</p>
          <ul className="space-y-2">
            {passwordRequirements.map((requirement) => (
              <li key={requirement.label} className={`flex items-center gap-2 text-sm ${requirement.valid ? "text-emerald-600" : "text-red-500"}`}>
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${requirement.valid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {requirement.valid ? "✓" : "✕"}
                </span>
                {requirement.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-3 sm:col-span-2"><button type="submit" disabled={isSubmitting || !isPasswordStrongEnough} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Submitting..." : "Create user"}</button><button type="button" onClick={onCancel} className="rounded-xl border border-slate-500 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-800 hover:bg-white/30">Back</button></div>
      </form>
    </section>
  );
}

export function UserRegistrationForm({ onCancel }: { onCancel: () => void }) {
  return <FormContent onCancel={onCancel} />;
}
"use client";

import type { Account } from "../domain/Account";
import type { AccountText } from "../utils/accountTranslations";

interface AccountDetailsModalProps {
  account: Account;
  text: AccountText;
  error: string | null;
  isLoading: boolean;
  onClose: () => void;
}

function formatDate(value?: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
}

export function AccountDetailsModal({
  account,
  text,
  error,
  isLoading,
  onClose,
}: AccountDetailsModalProps) {
  const formatCurrency = (value: number) => new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);

  const fields = [
    { label: text.iban, value: account.iban },
    { label: text.balance, value: formatCurrency(account.balance) },
    { label: text.type, value: account.typeAccount === "PAYROLL_ACCOUNT" ? text.payroll : text.current },
    { label: text.owner, value: account.idUser ?? "-" },
    { label: text.phone, value: account.phoneNumber || text.noPhone },
    { label: text.createdAt, value: formatDate(account.createdAt) },
    { label: text.updatedAt, value: formatDate(account.updatedAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="account-details-title">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{text.accounts}</p>
            <h2 id="account-details-title" className="mt-2 text-2xl font-semibold text-white">
              {text.detailsTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-500 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
          >
            {text.close}
          </button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-300">{text.detailsLoading}</p>
        ) : null}

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="rounded-xl border border-cyan-300/20 bg-slate-950/30 p-3.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">{field.label}</dt>
              <dd className="mt-2 break-words text-sm font-semibold leading-relaxed text-slate-100">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

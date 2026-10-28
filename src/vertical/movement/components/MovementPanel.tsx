"use client";

import type { Account } from "../../account/domain/Account";
import { useMovements } from "../hooks/useMovements";
import { getMovementText, type Language } from "../utils/movementTranslations";

interface MovementPanelProps {
  account: Account;
  language?: Language;
  refreshKey?: number;
}

export function MovementPanel({ account, language = "en", refreshKey = 0 }: MovementPanelProps) {
  const text = getMovementText(language);
  const { movements, isLoading, error, reload } = useMovements(account.id, text, refreshKey);

  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "ca-ES";
  const typeLabels: Record<string, string> = {
    DEPOSIT: text.deposit,
    WITHDRAWAL: text.withdrawal,
    TRANSFER: text.transfer,
    PAYMENT: text.payment,
    BIZUM: text.bizum,
    REFUND: text.refund,
    CREDIT_CARD_PAYMENT: text.creditCardPayment,
    CREDIT_CARD_DEBT_PAYMENT: text.creditCardDebtPayment,
    DEBIT_CARD_PAYMENT: text.debitCardPayment,
  };
  const typeLabel = (type: string) => typeLabels[type] ?? text.other;
  const formatSignedCurrency = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    signDisplay: "exceptZero",
  }).format(value);
  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
  };
  const amountClass = (value: number) => (
    value > 0 ? "text-emerald-300" : value < 0 ? "text-pink-300" : "text-slate-200"
  );

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/80">{text.movements}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{text.subtitle}</h3>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          disabled={isLoading}
          className="rounded-xl border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10 disabled:opacity-50"
        >
          {text.refresh}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400">{text.latest}</p>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {isLoading ? <p className="mt-5 text-sm text-slate-300">{text.loading}</p> : null}

      {!isLoading && !error && movements.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-600 p-5 text-center">
          <p className="text-sm font-semibold text-slate-200">{text.empty}</p>
          <p className="mt-1 text-xs text-slate-400">{text.emptyHint}</p>
        </div>
      ) : null}

      {movements.length > 0 ? (
        <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
          {movements.map((movement) => (
            <li
              key={movement.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-900/40 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {movement.description || typeLabel(movement.type)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {typeLabel(movement.type)} · {formatDate(movement.createdAt)}
                </p>
              </div>
              <p className={`shrink-0 text-sm font-semibold ${amountClass(movement.amount)}`}>
                {formatSignedCurrency(movement.amount)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

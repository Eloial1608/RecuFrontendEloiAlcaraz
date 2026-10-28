"use client";

import { useState, type FormEvent } from "react";
import type { Account } from "../../account/domain/Account";
import type { BizumPayload } from "../domain/Operation";
import type { OperationText } from "../utils/operationTranslations";

interface BizumModalProps {
  source: Account;
  text: OperationText;
  locale: string;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: BizumPayload) => Promise<void>;
}

export function BizumModal({
  source,
  text,
  locale,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: BizumModalProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(value);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      setValidationError(text.invalidPhone);
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || !Number.isInteger(numericAmount) || numericAmount <= 0) {
      setValidationError(text.invalidAmount);
      return;
    }

    if (numericAmount > source.balance) {
      setValidationError(text.insufficientFunds);
      return;
    }

    await onSubmit({
      originAccountId: source.id,
      phone: normalizedPhone,
      amount: numericAmount,
      description: description.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="bizum-title">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h2 id="bizum-title" className="text-2xl font-semibold text-white">{text.bizumTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{text.bizumHint}</p>

        <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/30 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/80">{text.from}</p>
          <p className="mt-1 font-semibold text-white">{source.iban}</p>
          <p className="mt-1 text-slate-300">
            {text.available}: <span className="font-semibold text-white">{formatCurrency(source.balance)}</span>
          </p>
        </div>

        <label className="mt-4 block text-sm text-slate-200">
          {text.recipientPhone}
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={text.phonePlaceholder}
            autoComplete="tel"
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-200">
          {text.amount}
          <input
            required
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-200">
          {text.description}
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={120}
            placeholder={text.descriptionPlaceholder}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
          />
        </label>

        {validationError ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {validationError}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-500 px-4 py-2.5 font-medium text-slate-200 disabled:opacity-50"
          >
            {text.cancel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-pink-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-50"
          >
            {isSubmitting ? text.sending : text.submitBizum}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import type { Account } from "../../account/domain/Account";
import type { CardCreatePayload, CardType } from "../domain/Card";
import type { CardText } from "../utils/cardTranslations";

interface CardFormModalProps {
  account: Account;
  text: CardText;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (payload: CardCreatePayload) => Promise<void>;
}

export function CardFormModal({
  account,
  text,
  error,
  isSubmitting,
  onClose,
  onCreate,
}: CardFormModalProps) {
  const [type, setType] = useState<CardType>("DEBIT_CARD");
  const [pin, setPin] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (!/^[0-9]{4}$/.test(pin)) {
      setValidationError(text.invalidPin);
      return;
    }

    await onCreate({ type_Card: type, cardPin: pin, accountId: account.id });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="card-form-title">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h2 id="card-form-title" className="text-2xl font-semibold text-white">{text.addTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{text.addHint}</p>

        <p className="mt-4 break-all rounded-xl border border-slate-700/60 bg-slate-950/40 p-3 text-sm text-slate-300">
          <span className="font-semibold text-slate-100">{text.account}:</span> {account.iban}
        </p>

        <label className="mt-4 block text-sm text-slate-200">
          {text.type}
          <select
            value={type}
            onChange={(event) => setType(event.target.value as CardType)}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
          >
            <option value="DEBIT_CARD">{text.debit}</option>
            <option value="CREDIT_CARD">{text.credit}</option>
          </select>
        </label>

        <label className="mt-4 block text-sm text-slate-200">
          {text.pin}
          <input
            required
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            pattern="[0-9]{4}"
            value={pin}
            onChange={(event) => {
              setValidationError(null);
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 font-mono text-slate-100"
          />
        </label>
        <p className="mt-1 text-xs text-slate-400">{text.pinHint}</p>

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
            className="rounded-xl bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-50"
          >
            {isSubmitting ? text.creating : text.create}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import type { Card } from "../domain/Card";
import type { CardText } from "../utils/cardTranslations";
import { maskCardNumber } from "../utils/cardFormat";

interface CardPinModalProps {
  card: Card;
  text: CardText;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (cardId: string, pin: string) => Promise<void>;
}

export function CardPinModal({
  card,
  text,
  error,
  isSubmitting,
  onClose,
  onSave,
}: CardPinModalProps) {
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (!/^[0-9]{4}$/.test(pin)) {
      setValidationError(text.invalidPin);
      return;
    }

    if (pin !== confirmation) {
      setValidationError(text.pinMismatch);
      return;
    }

    await onSave(card.id, pin);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="card-pin-title">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h2 id="card-pin-title" className="text-2xl font-semibold text-white">{text.pinTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{text.newPinHint}</p>
        <p className="mt-3 font-mono text-sm text-slate-100">{maskCardNumber(card.numCard)}</p>

        <label className="mt-5 block text-sm text-slate-200">
          {text.newPin}
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

        <label className="mt-4 block text-sm text-slate-200">
          {text.confirmPin}
          <input
            required
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            pattern="[0-9]{4}"
            value={confirmation}
            onChange={(event) => {
              setValidationError(null);
              setConfirmation(event.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 font-mono text-slate-100"
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
            className="rounded-xl bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-50"
          >
            {isSubmitting ? text.saving : text.changePin}
          </button>
        </div>
      </form>
    </div>
  );
}

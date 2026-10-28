"use client";

import type { Card } from "../domain/Card";
import type { CardText } from "../utils/cardTranslations";
import { maskCardNumber } from "../utils/cardFormat";

interface CardDeleteModalProps {
  card: Card;
  text: CardText;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function CardDeleteModal({
  card,
  text,
  error,
  isSubmitting,
  onClose,
  onConfirm,
}: CardDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="card-delete-title">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-300">{text.cards}</p>
        <h2 id="card-delete-title" className="mt-2 text-2xl font-semibold text-white">{text.deleteTitle}</h2>
        <p className="mt-4 text-sm text-slate-200">{text.deleteQuestion}</p>
        <p className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {text.deleteWarning}
        </p>
        <p className="mt-3 font-mono text-sm font-semibold text-slate-100">{maskCardNumber(card.numCard)}</p>

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
            type="button"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {isSubmitting ? text.deleting : text.confirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
}

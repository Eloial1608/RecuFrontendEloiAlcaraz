"use client";

import { useEffect, useMemo, useState } from "react";
import type { Account } from "../../account/domain/Account";
import type { Card, CardCreatePayload } from "../domain/Card";
import { useCards } from "../hooks/useCards";
import { getCardText, type Language } from "../utils/cardTranslations";
import { formatExpiration, maskCardNumber } from "../utils/cardFormat";
import { CardFormModal } from "./CardFormModal";
import { CardLimitModal } from "./CardLimitModal";
import { CardPinModal } from "./CardPinModal";
import { CardDeleteModal } from "./CardDeleteModal";

type Modal =
  | { kind: "create" }
  | { kind: "limit"; card: Card }
  | { kind: "pin"; card: Card }
  | { kind: "delete"; card: Card }
  | null;

interface CardPanelProps {
  account: Account;
  language?: Language;
}

export function CardPanel({ account, language = "en" }: CardPanelProps) {
  const text = getCardText(language);
  const {
    cards,
    isLoading,
    isSubmitting,
    message,
    error,
    create,
    setLimit,
    setBlocked,
    changePin,
    remove,
    clearFeedback,
  } = useCards(text);

  const [modal, setModal] = useState<Modal>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    clearFeedback();
  }, [account.id, clearFeedback]);

  const accountCards = useMemo(
    () => cards.filter((card) => card.accountId === account.id),
    [account.id, cards],
  );

  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "ca-ES";
  const formatCurrency = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(value);
  const typeLabel = (type: Card["type_Card"]) => (
    type === "CREDIT_CARD" ? text.credit : text.debit
  );

  function openModal(nextModal: Exclude<Modal, null>) {
    clearFeedback();
    setModal(nextModal);
  }

  function toggleReveal(cardId: string) {
    setRevealed((current) => ({ ...current, [cardId]: !current[cardId] }));
  }

  async function handleCreate(payload: CardCreatePayload) {
    const wasCreated = await create(payload);
    if (wasCreated) setModal(null);
  }

  async function handleLimit(cardId: string, limit: number) {
    const wasUpdated = await setLimit(cardId, limit);
    if (wasUpdated) setModal(null);
  }

  async function handlePin(cardId: string, pin: string) {
    const wasUpdated = await changePin(cardId, pin);
    if (wasUpdated) setModal(null);
  }

  async function handleDelete(cardId: string) {
    const wasDeleted = await remove(cardId);
    if (wasDeleted) setModal(null);
  }

  async function handleBlock(card: Card) {
    await setBlocked(card.id, !card.isBlocked);
  }

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/80">{text.cards}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{text.subtitle}</h3>
        </div>
        <button
          type="button"
          onClick={() => openModal({ kind: "create" })}
          disabled={isSubmitting}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          {text.add}
        </button>
      </div>

      {message ? (
        <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}
      {!modal && error ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {isLoading ? <p className="mt-5 text-sm text-slate-300">{text.loading}</p> : null}

      {!isLoading && accountCards.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-600 p-5 text-center">
          <p className="text-sm font-semibold text-slate-200">{text.empty}</p>
          <p className="mt-1 text-xs text-slate-400">{text.emptyHint}</p>
        </div>
      ) : null}

      {accountCards.length > 0 ? (
        <div className="mt-5 space-y-4">
          {accountCards.map((card) => {
            const isRevealed = revealed[card.id] === true;

            return (
              <article
                key={card.id}
                className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 p-5"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                        {typeLabel(card.type_Card)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {text.expiration} {card.expiration ? formatExpiration(card.expiration) : "—"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        card.isBlocked
                          ? "border-red-400/40 bg-red-500/10 text-red-200"
                          : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      {card.isBlocked ? text.blocked : text.active}
                    </span>
                  </div>

                  <p className="mt-5 font-mono text-lg tracking-[0.16em] text-white">
                    {maskCardNumber(card.numCard, isRevealed)}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">{text.balance}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(card.balance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{text.limit}</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {card.type_Card === "CREDIT_CARD" ? formatCurrency(card.limitCard) : text.noLimit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{text.cvv}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {isRevealed ? card.cvv || "—" : "•••"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleReveal(card.id)}
                      aria-pressed={isRevealed}
                      className="rounded-lg border border-cyan-300/40 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
                    >
                      {isRevealed ? text.hide : text.show}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleBlock(card)}
                      disabled={isSubmitting}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        card.isBlocked
                          ? "border-emerald-400/40 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-500/10"
                          : "border-pink-400/40 text-pink-200 hover:border-pink-300 hover:bg-pink-500/10"
                      }`}
                    >
                      {card.isBlocked ? text.unblock : text.block}
                    </button>
                    {card.type_Card === "CREDIT_CARD" ? (
                      <button
                        type="button"
                        onClick={() => openModal({ kind: "limit", card })}
                        disabled={isSubmitting}
                        className="rounded-lg border border-slate-500 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                      >
                        {text.limit}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openModal({ kind: "pin", card })}
                      disabled={isSubmitting}
                      className="rounded-lg border border-slate-500 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                    >
                      {text.changePin}
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal({ kind: "delete", card })}
                      disabled={isSubmitting}
                      className="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {text.delete}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {modal?.kind === "create" ? (
        <CardFormModal
          account={account}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
        />
      ) : null}

      {modal?.kind === "limit" ? (
        <CardLimitModal
          key={modal.card.id}
          card={modal.card}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onSave={handleLimit}
        />
      ) : null}

      {modal?.kind === "pin" ? (
        <CardPinModal
          key={modal.card.id}
          card={modal.card}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onSave={handlePin}
        />
      ) : null}

      {modal?.kind === "delete" ? (
        <CardDeleteModal
          card={modal.card}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onConfirm={() => handleDelete(modal.card.id)}
        />
      ) : null}
    </section>
  );
}

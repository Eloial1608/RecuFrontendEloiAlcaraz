"use client";

import { useState } from "react";
import type { Account } from "../../account/domain/Account";
import { useOperations } from "../hooks/useOperations";
import { getOperationText, type Language } from "../utils/operationTranslations";
import { BizumModal } from "./BizumModal";
import { TransferModal } from "./TransferModal";

type Modal = "transfer" | "bizum" | null;

interface AccountOperationsProps {
  account: Account;
  accounts: Account[];
  language?: Language;
  onCompleted: () => Promise<void> | void;
}

export function AccountOperations({
  account,
  accounts,
  language = "en",
  onCompleted,
}: AccountOperationsProps) {
  const text = getOperationText(language);
  const {
    isSubmitting,
    message,
    error,
    transfer,
    bizum,
    clearFeedback,
  } = useOperations(text);
  const [modal, setModal] = useState<Modal>(null);

  const canTransfer = accounts.some((candidate) => candidate.id !== account.id);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "ca-ES";

  function openModal(nextModal: Exclude<Modal, null>) {
    clearFeedback();
    setModal(nextModal);
  }

  function closeModal() {
    clearFeedback();
    setModal(null);
  }

  async function handleTransfer(payload: Parameters<typeof transfer>[0]) {
    const wasSent = await transfer(payload);
    if (!wasSent) return;

    setModal(null);
    await onCompleted();
  }

  async function handleBizum(payload: Parameters<typeof bizum>[0]) {
    const wasSent = await bizum(payload);
    if (!wasSent) return;

    setModal(null);
    await onCompleted();
  }

  return (
    <>
      <section className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-950/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/80">{text.sendMoney}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{text.subtitle}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openModal("transfer")}
              disabled={isSubmitting || !canTransfer}
              title={canTransfer ? undefined : text.noDestination}
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {text.transfer}
            </button>
            <button
              type="button"
              onClick={() => openModal("bizum")}
              disabled={isSubmitting}
              className="rounded-xl bg-[#ff4fd8] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-pink-300 disabled:opacity-50"
            >
              {text.bizum}
            </button>
          </div>
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
        {!canTransfer ? <p className="mt-3 text-sm text-amber-200">{text.noDestination}</p> : null}
      </section>

      {modal === "transfer" ? (
        <TransferModal
          source={account}
          accounts={accounts}
          text={text}
          locale={locale}
          error={error}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleTransfer}
        />
      ) : null}

      {modal === "bizum" ? (
        <BizumModal
          source={account}
          text={text}
          locale={locale}
          error={error}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleBizum}
        />
      ) : null}
    </>
  );
}

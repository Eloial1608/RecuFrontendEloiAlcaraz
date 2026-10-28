"use client";

import { useEffect, useRef, useState } from "react";
import { type Account, type AccountType, type AccountUpdatePayload } from "../domain/Account";
import { useAccounts } from "../hooks/useAccounts";
import { getAccountText, type Language } from "../utils/accountTranslations";
import { AccountFormModal } from "./AccountFormModal";
import { AccountDetailsModal } from "./AccountDetailsModal";
import { AccountDeleteModal } from "./AccountDeleteModal";
import { CardPanel } from "../../card/components/CardPanel";
import { MovementPanel } from "../../movement/components/MovementPanel";
import { AccountOperations } from "../../operation/components/AccountOperations";

type Modal = "create" | "edit" | "delete" | "details" | null;

export function AccountPanel({ language = "en" }: { language?: Language }) {
  const text = getAccountText(language);
  const {
    accounts,
    isLoading,
    isSubmitting,
    message,
    error,
    create,
    update,
    updateBalance,
    remove,
    loadDetails,
    refresh,
    clearFeedback,
  } = useAccounts(text);

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [balanceDrafts, setBalanceDrafts] = useState<Record<string, string>>({});
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [movementRefreshKey, setMovementRefreshKey] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [detailsAccount, setDetailsAccount] = useState<Account | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const detailsRequestId = useRef(0);

  useEffect(() => {
    setSelectedAccountId((current) => {
      if (current && accounts.some((account) => account.id === current)) return current;
      return accounts[0]?.id ?? null;
    });
  }, [accounts]);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountIndex = Math.max(
    accounts.findIndex((account) => account.id === selectedAccount?.id),
    0,
  );
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "ca-ES";
  const formatCurrency = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(value);
  const typeLabel = (typeAccount: AccountType) => (
    typeAccount === "PAYROLL_ACCOUNT" ? text.payroll : text.current
  );

  function openModal(nextModal: Exclude<Modal, null>) {
    clearFeedback();
    setBalanceError(null);
    setModal(nextModal);
  }

  async function openDetails() {
    if (!selectedAccount) return;

    const requestId = detailsRequestId.current + 1;
    detailsRequestId.current = requestId;

    openModal("details");
    setDetailsAccount(selectedAccount);
    setIsDetailsLoading(true);

    const freshAccount = await loadDetails(selectedAccount.id);
    if (detailsRequestId.current !== requestId) return;

    if (freshAccount) setDetailsAccount(freshAccount);
    setIsDetailsLoading(false);
  }

  async function handleCreate(typeAccount: AccountType) {
    const wasCreated = await create(typeAccount);
    if (wasCreated) setModal(null);
  }

  async function handleUpdate(payload: AccountUpdatePayload) {
    if (!selectedAccount) return;

    const wasUpdated = await update(selectedAccount.id, payload);
    if (wasUpdated) setModal(null);
  }

  async function handleDelete() {
    if (!selectedAccount) return;

    const wasDeleted = await remove(selectedAccount.id);
    if (wasDeleted) setModal(null);
  }

  async function handleBalanceUpdate(account: Account) {
    const value = balanceDrafts[account.id];
    if (value === undefined || value.trim() === "") return;

    const amount = Number(value);
    if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
      setBalanceError(text.invalidBalance);
      return;
    }

    setBalanceError(null);
    const wasUpdated = await updateBalance(account.id, amount);
    if (wasUpdated) {
      setBalanceDrafts((current) => ({ ...current, [account.id]: "" }));
    }
  }

  async function handleOperationCompleted() {
    await refresh();
    setMovementRefreshKey((current) => current + 1);
  }

  return (
    <section className="mt-10 border-t border-cyan-300/20 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{text.accounts}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{text.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => openModal("create")}
          disabled={isSubmitting}
          className="rounded-xl bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          {text.create}
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

      {isLoading ? <p className="mt-6 text-slate-300">{text.loading}</p> : null}
      {!isLoading && accounts.length === 0 ? <p className="mt-6 text-slate-300">{text.empty}</p> : null}

      {accounts.length > 0 ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {accounts.length > 1 ? (
              <label className="text-sm text-slate-200">
                {text.select}
                <select
                  value={selectedAccount?.id ?? ""}
                  onChange={(event) => setSelectedAccountId(event.target.value)}
                  className="glass-input ml-3 rounded-xl border px-3 py-2 text-slate-100"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.iban}</option>
                  ))}
                </select>
              </label>
            ) : <span className="text-sm text-slate-300">{text.overview}</span>}
            <p className="text-sm text-slate-300">
              {text.total}
              <strong className="ml-2 text-lg text-white">{formatCurrency(totalBalance)}</strong>
            </p>
          </div>

          <article className="mt-4 rounded-2xl border border-cyan-300/30 bg-slate-950/30 p-5">
            {selectedAccount ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{selectedAccount.iban}</p>
                    <p className="mt-1 text-sm text-slate-300">{typeLabel(selectedAccount.typeAccount)}</p>
                  </div>
                  <p className="text-2xl font-semibold text-white">{formatCurrency(selectedAccount.balance)}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void openDetails()}
                    disabled={isSubmitting}
                    className="rounded-xl border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10 disabled:opacity-50"
                  >
                    {text.details}
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal("edit")}
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                  >
                    {text.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal("delete")}
                    disabled={isSubmitting}
                    className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {text.delete}
                  </button>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleBalanceUpdate(selectedAccount);
                  }}
                  className="mt-5 flex flex-wrap items-center gap-3"
                >
                  <label className="sr-only" htmlFor="quick-balance">{text.newBalance}</label>
                  <input
                    id="quick-balance"
                    type="number"
                    step="1"
                    value={balanceDrafts[selectedAccount.id] ?? ""}
                    onChange={(event) => {
                      setBalanceError(null);
                      setBalanceDrafts((current) => ({ ...current, [selectedAccount.id]: event.target.value }));
                    }}
                    placeholder={text.newBalance}
                    className="glass-input rounded-xl border px-3 py-2 text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                  >
                    {text.update}
                  </button>
                </form>

                {balanceError ? (
                  <p role="alert" className="mt-3 text-sm text-red-300">{balanceError}</p>
                ) : null}
              </>
            ) : null}
          </article>

          {selectedAccount ? (
            <AccountOperations
              account={selectedAccount}
              accounts={accounts}
              language={language}
              onCompleted={handleOperationCompleted}
            />
          ) : null}

          {accounts.length > 1 ? (
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                aria-label={text.previous}
                onClick={() => setSelectedAccountId(accounts[(selectedAccountIndex - 1 + accounts.length) % accounts.length]?.id ?? null)}
                className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200"
              >
                {text.previous}
              </button>
              <button
                type="button"
                aria-label={text.next}
                onClick={() => setSelectedAccountId(accounts[(selectedAccountIndex + 1) % accounts.length]?.id ?? null)}
                className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200"
              >
                {text.next}
              </button>
            </div>
          ) : null}

          {selectedAccount ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <CardPanel account={selectedAccount} language={language} />
              <MovementPanel account={selectedAccount} language={language} refreshKey={movementRefreshKey} />
            </div>
          ) : null}
        </div>
      ) : null}

      {modal === "create" ? (
        <AccountFormModal
          mode="create"
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      ) : null}

      {modal === "edit" && selectedAccount ? (
        <AccountFormModal
          key={selectedAccount.id}
          mode="edit"
          account={selectedAccount}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      ) : null}

      {modal === "delete" && selectedAccount ? (
        <AccountDeleteModal
          account={selectedAccount}
          text={text}
          error={error}
          isSubmitting={isSubmitting}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      ) : null}

      {modal === "details" && detailsAccount ? (
        <AccountDetailsModal
          account={detailsAccount}
          text={text}
          error={error}
          isLoading={isDetailsLoading}
          onClose={() => setModal(null)}
        />
      ) : null}
    </section>
  );
}

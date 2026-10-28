"use client";

import { useState, type FormEvent } from "react";
import { ACCOUNT_TYPES, type Account, type AccountType, type AccountUpdatePayload } from "../domain/Account";
import type { AccountText } from "../utils/accountTranslations";

interface AccountFormModalProps {
  mode: "create" | "edit";
  account?: Account;
  text: AccountText;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (typeAccount: AccountType) => Promise<void>;
  onUpdate: (payload: AccountUpdatePayload) => Promise<void>;
}

export function AccountFormModal({
  mode,
  account,
  text,
  error,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: AccountFormModalProps) {
  const [iban, setIban] = useState(account?.iban ?? "");
  const [balance, setBalance] = useState(account ? String(account.balance) : "0");
  const [typeAccount, setTypeAccount] = useState<AccountType>(account?.typeAccount ?? ACCOUNT_TYPES[0]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (!isEdit) {
      await onCreate(typeAccount);
      return;
    }

    const normalizedIban = iban.replace(/\s+/g, "").toUpperCase();
    const numericBalance = Number(balance);

    if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(normalizedIban)) {
      setValidationError(text.invalidIban);
      return;
    }

    if (balance.trim() === "" || !Number.isFinite(numericBalance) || !Number.isInteger(numericBalance)) {
      setValidationError(text.invalidBalance);
      return;
    }

    await onUpdate({ iban: normalizedIban, balance: numericBalance, typeAccount });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="account-form-title">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h2 id="account-form-title" className="text-2xl font-semibold text-white">
          {isEdit ? text.editTitle : text.create}
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          {isEdit ? text.editHint : text.choose}
        </p>

        {isEdit ? (
          <label className="mt-6 block text-sm text-slate-200">
            {text.iban}
            <input
              required
              value={iban}
              onChange={(event) => setIban(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
            />
          </label>
        ) : null}

        {isEdit ? (
          <label className="mt-4 block text-sm text-slate-200">
            {text.balance}
            <input
              required
              type="number"
              step="1"
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
              className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
            />
          </label>
        ) : null}

        <label className="mt-4 block text-sm text-slate-200">
          {text.type}
          <select
            value={typeAccount}
            onChange={(event) => setTypeAccount(event.target.value as AccountType)}
            className="glass-input mt-2 w-full rounded-xl border px-3 py-2.5 text-slate-100"
          >
            <option value="CURRENT_ACCOUNT">{text.current}</option>
            <option value="PAYROLL_ACCOUNT">{text.payroll}</option>
          </select>
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
            {isSubmitting ? (isEdit ? text.saving : text.creating) : (isEdit ? text.save : text.create)}
          </button>
        </div>
      </form>
    </div>
  );
}

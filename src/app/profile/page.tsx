"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/vertical/user";
import { clearAuthToken, loginUser } from "@/vertical/user/infrastructure/loginUser";
import { deleteUser, getMe, updateMe, updatePassword } from "@/vertical/user/infrastructure/getUsers";
import { useUser } from "@/vertical/user";

interface ProfileFormState {
  name: string;
  username: string;
  companyName: string;
  birthDate: string;
  address: string;
  city: string;
  zipCode: string;
}

const emptyProfileForm = (): ProfileFormState => ({
  name: "",
  username: "",
  companyName: "",
  birthDate: "",
  address: "",
  city: "",
  zipCode: "",
});

const formatDateLabel = (value?: string | null): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toISOString().slice(0, 10);
};

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm());
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = useMemo(
    () => [
      { label: "Mínim 8 caràcters", valid: newPassword.length >= 8 },
      { label: "Una majúscula", valid: /[A-Z]/.test(newPassword) },
      { label: "Una minúscula", valid: /[a-z]/.test(newPassword) },
      { label: "Un número", valid: /\d/.test(newPassword) },
      { label: "Un símbol", valid: /[^A-Za-z0-9]/.test(newPassword) },
    ],
    [newPassword],
  );

  const isPasswordStrongEnough = passwordRequirements.every((requirement) => requirement.valid);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await getMe();
      setUser(profile);
      setForm({
        name: profile.name ?? "",
        username: profile.username ?? "",
        companyName: profile.companyName ?? "",
        birthDate: profile.birthDate ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        zipCode: profile.zipCode ?? "",
      });
      setStatus(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load profile.";
      if (/401|Unauthorized|forbidden|token/i.test(message)) {
        clearAuthToken();
        router.replace("/");
        return;
      }
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/");
      return;
    }

    if (isAuthenticated) {
      void loadProfile();
    }
  }, [isAuthReady, isAuthenticated, router]);

  const overviewFields = useMemo(
    () => [
      { label: "Username", value: user?.username || "-" },
      { label: "Email", value: user?.email || "-" },
      { label: "Role", value: user?.isAdmin ? "Administrator" : "User" },
      { label: "Company", value: user?.companyName || "-" },
      { label: "Document type", value: user?.identityDocType || "-" },
      { label: "Document number", value: user?.identityDocNumber || "-" },
      { label: "Phone", value: user?.phoneNumber || "-" },
    ],
    [user],
  );

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      setStatus(null);

      await updateMe({ ...form });
      const updatedUser = await getMe();
      setUser(updatedUser);
      setForm({
        name: updatedUser.name ?? "",
        username: updatedUser.username ?? "",
        companyName: updatedUser.companyName ?? "",
        birthDate: updatedUser.birthDate ?? "",
        address: updatedUser.address ?? "",
        city: updatedUser.city ?? "",
        zipCode: updatedUser.zipCode ?? "",
      });
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile.";
      if (/401|Unauthorized|forbidden|token/i.test(message)) {
        clearAuthToken();
        router.replace("/");
        return;
      }
      setStatus({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.id) return;

    if (!oldPassword.trim()) {
      setStatus({ type: "error", message: "Enter your current password." });
      return;
    }

    if (!isPasswordStrongEnough) {
      setStatus({ type: "error", message: "The new password does not meet the minimum requirements." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "The new passwords do not match." });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setStatus(null);

      try {
        await loginUser(user.email, oldPassword);
      } catch {
        setStatus({ type: "error", message: "Current password is incorrect." });
        setIsUpdatingPassword(false);
        return;
      }

      await updatePassword(user.id, newPassword.trim());
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsPasswordModalOpen(false);
      setStatus({ type: "success", message: "Password changed successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password.";
      if (/401|Unauthorized|forbidden|token/i.test(message)) {
        clearAuthToken();
        router.replace("/");
        return;
      }
      setStatus({ type: "error", message });
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user?.id) return;

    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setStatus(null);
      await deleteUser(user.id);
      clearAuthToken();
      router.replace("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete account.";
      if (/401|Unauthorized|forbidden|token/i.test(message)) {
        clearAuthToken();
        router.replace("/");
        return;
      }
      setStatus({ type: "error", message });
      setIsDeleting(false);
    }
  }

  if (!isAuthReady || !isAuthenticated) {
    return <main className="glass-page flex min-h-screen items-center justify-center text-slate-700">Checking your session...</main>;
  }

  return (
    <main className="glass-page min-h-screen px-4 py-10 text-slate-800 sm:px-8">
      <div className={isPasswordModalOpen ? "pointer-events-none select-none blur-[2px] transition duration-200" : "transition duration-200"}>
        <section className="glass-panel mx-auto mt-12 max-w-5xl rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Banca Nova</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Profile</h1>
            </div>
            <button type="button" onClick={() => router.push("/dashboard")} className="rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700">
              Back to dashboard
            </button>
          </div>

          {status ? (
            <div className={`mt-6 rounded-xl border p-3 text-sm ${status.type === "success" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" : "border-red-500/40 bg-red-500/10 text-red-200"}`}>
              {status.message}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/20 p-6 text-slate-200">Loading profile...</div>
          ) : user ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-900/20 p-5 shadow-sm">
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-800/50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">Full name</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-white">{user.name || user.username || "User"}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {overviewFields.map((field) => (
                    <div key={field.label} className="rounded-xl border border-slate-200 bg-slate-800/30 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">{field.label}</p>
                      <p className="mt-2 break-words text-base font-semibold text-slate-100 leading-relaxed">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-200 bg-slate-900/20 p-5">
                  <h2 className="text-xl font-bold text-white">Edit profile</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-slate-200 sm:col-span-2">
                      Name
                      <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200 sm:col-span-2">
                      Username
                      <input required value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200 sm:col-span-2">
                      Company name
                      <input value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200">
                      Birth date
                      <input required type="date" value={form.birthDate ? form.birthDate.slice(0, 10) : ""} onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200">
                      ZIP code
                      <input required value={form.zipCode} onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200 sm:col-span-2">
                      Address
                      <input required value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>

                    <label className="text-sm text-slate-200 sm:col-span-2">
                      City
                      <input required value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-400" />
                    </label>
                  </div>

                  <button type="submit" disabled={isSaving} className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-slate-900/20 p-5">
                  <h2 className="text-xl font-bold text-white">Password</h2>
                  <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="mt-5 rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                    Change password
                  </button>
                </div>

                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
                  <h2 className="text-xl font-bold text-white">Delete account</h2>
                  <p className="mt-2 text-sm text-red-100">This action is permanent and will log you out.</p>
                  <button type="button" onClick={handleDeleteAccount} disabled={isDeleting} className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">
                    {isDeleting ? "Deleting..." : "Delete account"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {isPasswordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Security</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Change password</h2>
              </div>
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="rounded-full border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800">
                Close
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-200">Current password</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5">
                  <input type={showOldPassword ? "text" : "password"} value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-400" placeholder="Enter your current password" />
                  <button type="button" onClick={() => setShowOldPassword((current) => !current)} className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {showOldPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">New password</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5">
                  <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-400" />
                  <button type="button" onClick={() => setShowNewPassword((current) => !current)} className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Repeat new password</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2.5">
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-400" placeholder="Repeat the new password" />
                  <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
                <p className="mb-3 text-sm font-medium text-slate-200">Password requirements</p>
                <ul className="space-y-2">
                  {passwordRequirements.map((requirement) => (
                    <li key={requirement.label} className={`flex items-center gap-2 text-sm ${requirement.valid ? "text-emerald-400" : "text-red-400"}`}>
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${requirement.valid ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                        {requirement.valid ? "✓" : "✕"}
                      </span>
                      {requirement.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="rounded-xl border border-slate-600 px-4 py-2.5 font-semibold text-slate-200 transition hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdatingPassword || !isPasswordStrongEnough || !oldPassword.trim() || newPassword !== confirmPassword} className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
                  {isUpdatingPassword ? "Updating..." : "Save password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

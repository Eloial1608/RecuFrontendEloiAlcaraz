"use client";

import { useEffect, useState } from "react";
import type { User } from "../domain/User";
import { getMe } from "../infrastructure/getUsers";

export function UserList() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load user.");
      });
  }, []);

  if (error) return <p className="mt-8 text-red-700">{error}</p>;

  return (
    <section className="mt-8 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
      {!user ? (
        <p className="mt-3 text-slate-600">No user found.</p>
      ) : (
        <article className="mt-4 rounded-xl bg-white/60 p-4">
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-slate-600">{user.email}</p>
        </article>
      )}
    </section>
  );
}
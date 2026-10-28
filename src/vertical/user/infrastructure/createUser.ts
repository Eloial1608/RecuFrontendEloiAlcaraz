import type { User } from "../domain/User";

const USERS_ENDPOINT = "/api/users";

export async function createUser(user: User): Promise<void> {
  const response = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to create user (${response.status}).`);
  }
}
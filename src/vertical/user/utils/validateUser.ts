import type { User } from "../domain/User";

export function validateUser(user: User): string | null {
  if (!user.name || !user.username || !user.email || !user.password) {
    return "Fill in all required fields.";
  }
  if (!user.identityDocNumber || !user.phoneNumber || !user.birthDate || !user.address || !user.city || !user.zipCode) {
    return "Complete your personal and contact details.";
  }
  return null;
}
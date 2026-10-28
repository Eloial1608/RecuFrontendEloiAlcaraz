"use client";

import { createContext, useEffect, useState } from "react";
import type { User } from "../domain/User";
import { createUser } from "../infrastructure/createUser";
import { clearAuthToken, getStoredToken, loginUser as requestLogin } from "../infrastructure/loginUser";
import { validateUser } from "../utils/validateUser";

interface UserContextValue {
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
  registerUser: (user: User) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(getStoredToken()));
    setIsAuthReady(true);
  }, []);

  async function registerUser(user: User) {
    const validationError = validateUser(user);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await createUser(user);
      setSuccess(true);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected registration error.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginUser(email: string, password: string) {
    if (!email || !password) {
      setError("Enter your email and password.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await requestLogin(email, password);
      setIsAuthenticated(true);
      setSuccess(true);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected sign-in error.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  function logout() {
    clearAuthToken();
    setIsAuthenticated(false);
    setSuccess(false);
  }

  return <UserContext.Provider value={{ isSubmitting, success, error, registerUser, loginUser, isAuthenticated, isAuthReady, logout }}>{children}</UserContext.Provider>;
}
export type UserRole = "Admin" | "Employee";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

const KEY = "koara_auth";

export function setAuth(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function isAdmin(): boolean {
  return getAuth()?.role === "Admin";
}

export function roleFromEmail(email: string): UserRole {
  return email === "admin@koara.com" ? "Admin" : "Employee";
}
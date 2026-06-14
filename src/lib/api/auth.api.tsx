import { AuthUser } from "@/lib/types/models";

const KEY = "koara_auth";
const LEGACY_KEY = "koara_token";

export function setAuth(user: AuthUser) {
  if (typeof window === "undefined") return;
  console.log('[Auth.api] setAuth: Saving user session...');

  localStorage.setItem(KEY, JSON.stringify(user));
  localStorage.setItem(LEGACY_KEY, user.token);
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed?.token) {
        return parsed;
      }
    } catch {
      console.warn('[Auth.api] getAuth: Error parsing session data');
    }
  }

  const token = localStorage.getItem(LEGACY_KEY);
  if (!token) return null;

  return {
    id: "",
    name: "",
    email: "",
    role: "EMPLOYEE",
    token,
  };
}

export function getAuthToken() {
  const auth = getAuth();
  
  if (auth?.token && auth.token !== "undefined" && auth.token !== "null") {
    console.log('[Auth.api] getAuthToken: Token found');
    return auth.token;
  }
  
  if (typeof window !== "undefined") {
    const legacyToken = localStorage.getItem(LEGACY_KEY);
    if (legacyToken && legacyToken !== "undefined" && legacyToken !== "null") {
      console.log('[Auth.api] getAuthToken: Legacy token found');
      return legacyToken;
    }
  }
  
  console.log('[Auth.api] getAuthToken: NO TOKEN FOUND');
  return null;
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  console.warn('[Auth.api] clearAuth: Session data cleared');

  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function isAdmin() {
  return getAuth()?.role === "ADMIN";
}

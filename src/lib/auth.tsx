// export type UserRole = "Admin" | "Employee" | "ADMIN" | "EMPLOYEE";

// export interface AuthUser {
//   name: string;
//   email: string;
//   role: UserRole;
//   token?: string;
// }

// const KEY = "koara_auth";
// const LEGACY_KEY = "koara_token";

// export function setAuth(user: AuthUser) {
//   if (typeof window === "undefined") return;

//   localStorage.setItem(KEY, JSON.stringify(user));
//   localStorage.setItem(LEGACY_KEY, user.token ?? "");
// }

// export function getAuth(): AuthUser | null {
//   if (typeof window === "undefined") return null;

//   const raw = localStorage.getItem(KEY);
//   if (raw) {
//     try {
//       return JSON.parse(raw) as AuthUser;
//     } catch {
//       // Fall through to the legacy token-only key.
//     }
//   }

//   const token = localStorage.getItem(LEGACY_KEY);
//   if (!token) return null;

//   return {
//     name: "",
//     email: "",
//     role: "EMPLOYEE",
//     token,
//   };
// }

// export function clearAuth() {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem(KEY);
//   localStorage.removeItem(LEGACY_KEY);
// }

// export function isAdmin(): boolean {
//   const role = getAuth()?.role;
//   return role === "Admin" || role === "ADMIN";
// }

// export function roleFromEmail(email: string): UserRole {
//   return email === "admin@koara.com" ? "Admin" : "Employee";
// }
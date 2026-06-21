import { apiGet, apiPost } from "@/lib/api/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ token: string; user: User }>("auth/login", { email, password }),
    
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    apiPost<void>("auth/register", data),
    
  forgotPassword: (email: string) =>
    apiPost<void>("auth/forgot-password", { email }),
    
  resetPassword: (token: string, password: string) =>
    apiPost<void>("auth/reset-password", { token, password }),

  getProfile: () => apiGet<User>("auth/profile"),
};
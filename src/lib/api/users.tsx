import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import { User } from "@/lib/api/auth";

export const usersApi = {
  getAll: () => apiGet<User[]>("users"),
  getById: (id: string) => apiGet<User>(`users/${id}`),
  create: (data: Omit<User, "id">) => apiPost<User>("users", data),
  update: (id: string, data: Partial<User>) => apiPut<User>(`users/${id}`, data),
  delete: (id: string) => apiDelete(`users/${id}`),
};

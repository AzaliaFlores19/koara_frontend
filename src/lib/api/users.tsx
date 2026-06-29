// import { apiGet, apiPost, apiPatch } from "./client";
// import { User } from "@/lib/api/auth";

// export const usersApi = {
//   getAll: (search?: string) => apiGet<User[]>(search ? `users?search=${search}` : "users"),
//   getById: (id: string) => apiGet<User>(`users/${id}`),
//   create: (data: Omit<User, "id" | "is_active"> & { password?: string }) => apiPost<User>("users", data),
//   update: (id: string, data: Partial<User> & { password?: string }) => apiPatch<User>(`users/${id}`, data),
//   deactivate: (id: string) => apiPatch<User>(`users/${id}/deactivate`, {}),
// };

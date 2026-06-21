import { apiClient } from "@/lib/api/axios";
import { User } from "@/lib/api/auth";
import { getAuth, isAdmin } from "@/lib/api/auth.api"; 

export const usersApi = {

  async getAll(search?: string) {
    const { data } = await apiClient.get<User[]>(search ? `users?search=${search}` : "users");
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<User>(`users/${id}`);
    return data;
  },

  async create(data: Omit<User, "id" | "is_active"> & { password?: string }) {
    const { data: res } = await apiClient.post<User>("users", data);
    return res;
  },

  async update(id: string, data: Partial<User> & { password?: string }) {
    const { data: res } = await apiClient.patch<User>(`users/${id}`, data);
    return res;
  },

  async deactivate(id: string) {
    const { data } = await apiClient.patch<User>(`users/${id}/deactivate`, {});
    return data;
  },

  // Profile Management
  async getProfile() {
    const auth = getAuth();
    
    const endpoint = isAdmin() && auth?.id ? `/users/${auth.id}` : "/users/me";
    
    const { data } = await apiClient.get(endpoint);
    return data;
  },

  async updateProfile(data: { name?: string; email?: string; phone?: string }) {
    const auth = getAuth();
    
    const endpoint = isAdmin() && auth?.id ? `/users/${auth.id}` : "/users/me";
    
    const { data: res } = await apiClient.patch(endpoint, data);
    return res;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const { data: res } = await apiClient.patch(
      "/users/me/change-password",
      data
    );
    return res;
  },
};
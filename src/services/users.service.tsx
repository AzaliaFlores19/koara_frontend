import { apiClient } from "@/lib/api/axios";
import { getAuth, isAdmin } from "@/lib/api/auth.api"; 

export const usersApi = {
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
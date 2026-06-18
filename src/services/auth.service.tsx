import { apiClient } from "@/lib/api/axios";
import { AuthUser, UserRole } from "@/lib/types/models";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };

  access_token: string;
}

interface ApiMessageResponse {
  message: string;
}

export const authApi = {
  async login(
    email: string,
    password: string
  ) {
    const { data } =
      await apiClient.post<LoginResponse>(
        "/auth/login",
        {
          email,
          password,
        }
      );

    return data;
  },

 
  async forgotPassword(email: string) {
    const { data } =
      await apiClient.post<ApiMessageResponse>(
        "/auth/forgot-password",
        {
          email,
        }
      );

    return data;
  },

  async resetPassword(token: string, password: string) {
    const { data } = await apiClient.post<ApiMessageResponse>("/auth/reset-password", {
      token,
      password,
    });
    return data;
  },
};

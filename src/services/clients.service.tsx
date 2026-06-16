import { apiClient } from "@/lib/api/axios";

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rtn: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDto {
  name: string;
  email?: string;
  phone?: string;
  rtn?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export const clientsApi = {
  async getAll(page = 1, limit = 10) {
    const { data } = await apiClient.get(`/clients?page=${page}&limit=${limit}`);
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get(`/clients/${id}`);
    return data;
  },

  async create(dto: CreateClientDto) {
    const { data } = await apiClient.post("/clients", dto);
    return data;
  },

  async update(id: string, dto: UpdateClientDto) {
    const { data } = await apiClient.patch(`/clients/${id}`, dto);
    return data;
  },

  async deactivate(id: string) {
    const { data } = await apiClient.patch(`/clients/${id}/deactivate`);
    return data;
  },

  async getTopProducts(id: string) {
    const { data } = await apiClient.get(`/clients/${id}/top-products`);
    return data;
  },

  async getHistory(id: string) {
    const { data } = await apiClient.get(`/clients/${id}/history`);
    return data;
  },
};

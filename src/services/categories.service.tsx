import { apiClient } from "@/lib/api/axios";

export interface Category {
  id: string;
  name: string;
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await apiClient.get("/categories?limit=100");
    return data.data as Category[];
  },

  async create(name: string): Promise<Category> {
    const { data } = await apiClient.post("/categories", { name });
    return data as Category;
  },

  async update(id: string, name: string): Promise<Category> {
    const { data } = await apiClient.patch(`/categories/${id}`, { name });
    return data as Category;
  },

  async deactivate(id: string) {
    const { data } = await apiClient.patch(`/categories/${id}/deactivate`);
    return data;
  },
};

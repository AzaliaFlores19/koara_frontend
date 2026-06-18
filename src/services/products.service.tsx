import { apiClient } from "@/lib/api/axios";
import type { Product } from "@/components/inventory/ProductCard";

const CARD_COLORS = ["#F5EDE8", "#F9D5E0", "#E8E8EC", "#EDF5EE"];

interface ApiProduct {
  id: string;
  name: string;
  code_bar: string;
  description: string | null;
  stock: number;
  min_stock: number;
  price: string;
  image: string | null;
  category: { id: string; name: string } | null;
}

export interface CreateProductDto {
  name: string;
  code_bar: string;
  description?: string;
  category_id: string;
  stock: number;
  min_stock?: number;
  price: number;
  image?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

function mapToProduct(p: ApiProduct, index: number): Product {
  return {
    id: p.id,
    name: p.name,
    code: p.code_bar,
    description: p.description ?? "",
    stock: p.stock,
    minStock: p.min_stock,
    price: parseFloat(p.price),
    category: p.category?.name ?? "",
    imageColor: CARD_COLORS[index % CARD_COLORS.length],
    image: p.image ?? undefined,
  };
}

export const productsApi = {
  async getAll(page = 1, limit = 8, search?: string, category_id?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append("search", search);
    if (category_id) params.append("category_id", category_id);
    const { data } = await apiClient.get(`/products?${params}`);
    return {
      data: (data.data as ApiProduct[]).map(mapToProduct),
      total: data.total as number,
      totalPages: data.totalPages as number,
    };
  },

  async create(dto: CreateProductDto) {
    const { data } = await apiClient.post("/products", dto);
    return mapToProduct(data as ApiProduct, 0);
  },

  async update(id: string, dto: UpdateProductDto) {
    const { data } = await apiClient.patch(`/products/${id}`, dto);
    return mapToProduct(data as ApiProduct, 0);
  },

  async deactivate(id: string) {
    const { data } = await apiClient.patch(`/products/${id}/deactivate`);
    return data;
  },
};

import { apiClient } from "@/lib/api/axios";
import type { PaymentMethod } from "@/lib/types/models";

export interface CartProduct {
  id: string;
  name: string;
  code_bar: string;
  description: string | null;
  image: string | null;
  stock: number;
  price: string;
  category: { id: string; name: string } | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unit_price: number;
  item_subtotal: number;
  available_stock: number;
  has_stock: boolean;
  product: CartProduct;
}

export interface CartSummary {
  total_items: number;
  subtotal: number;
  tax_rate: number;
  taxes: number;
  total: number;
}

export interface Cart {
  user_id: string;
  items: CartItem[];
  summary: CartSummary;
  created_at: string;
  updated_at: string;
}

export interface CheckoutDto {
  customerId: string;
  payment_method: PaymentMethod;
  taxRate?: number;
}

export const cartApi = {
  async getCart(taxRate?: number): Promise<Cart> {
    const params = taxRate !== undefined ? `?taxRate=${taxRate}` : "";
    const { data } = await apiClient.get(`/cart${params}`);
    return data as Cart;
  },

  async addItem(productId: string, quantity: number): Promise<Cart> {
    const { data } = await apiClient.post("/cart/items", { productId, quantity });
    return data as Cart;
  },

  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const { data } = await apiClient.patch(`/cart/items/${productId}`, { quantity });
    return data as Cart;
  },

  async removeItem(productId: string): Promise<Cart> {
    const { data } = await apiClient.delete(`/cart/items/${productId}`);
    return data as Cart;
  },

  async clearCart(): Promise<Cart> {
    const { data } = await apiClient.delete("/cart");
    return data as Cart;
  },

  async checkout(dto: CheckoutDto) {
    const { data } = await apiClient.post("/cart/checkout", dto);
    return data;
  },
};

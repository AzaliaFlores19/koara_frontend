"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { isAuthenticated } from "@/lib/api/auth.api";
import { cartApi, type Cart, type CheckoutDto } from "@/services/cart.service";

interface CartContextValue {
  cart: Cart | null;
  count: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  checkout: (dto: CheckoutDto) => Promise<unknown>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (productId: string, quantity: number) => {
    const data = await cartApi.addItem(productId, quantity);
    setCart(data);
  }, []);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    const data = await cartApi.updateItem(productId, quantity);
    setCart(data);
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const data = await cartApi.removeItem(productId);
    setCart(data);
  }, []);

  const clear = useCallback(async () => {
    const data = await cartApi.clearCart();
    setCart(data);
  }, []);

  const checkout = useCallback(
    async (dto: CheckoutDto) => {
      const invoice = await cartApi.checkout(dto);
      await refresh();
      return invoice;
    },
    [refresh],
  );

  const count = cart?.summary.total_items ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        loading,
        refresh,
        addItem,
        updateItem,
        removeItem,
        clear,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>.");
  }
  return ctx;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { QuoteItem } from "@/lib/db";

export type CartItem = QuoteItem & { key: string };

type Ctx = {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  add: (item: Omit<CartItem, "key">) => void;
  toggle: (productId: number, item: Omit<CartItem, "key">) => void;
  remove: (key: string) => void;
  update: (key: string, patch: Partial<CartItem>) => void;
  clear: () => void;
  isInCart: (productId: number | undefined) => boolean;
};

const STORAGE_KEY = "cnr-quote-cart-v1";
const Context = createContext<Ctx | null>(null);

function makeKey(productId?: number) {
  return `${productId ?? "x"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "key">) => {
    setItems((prev) => {
      if (item.productId && prev.some((p) => p.productId === item.productId)) return prev;
      return [...prev, { ...item, key: makeKey(item.productId) }];
    });
  }, []);

  const toggle = useCallback((productId: number, item: Omit<CartItem, "key">) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.productId === productId);
      if (exists) return prev.filter((p) => p.productId !== productId);
      return [...prev, { ...item, key: makeKey(productId) }];
    });
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const update = useCallback((key: string, patch: Partial<CartItem>) => {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: number | undefined) => (productId ? items.some((p) => p.productId === productId) : false),
    [items],
  );

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.length,
      hydrated,
      add,
      toggle,
      remove,
      update,
      clear,
      isInCart,
    }),
    [items, hydrated, add, toggle, remove, update, clear, isInCart],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useQuoteCart(): Ctx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useQuoteCart must be used inside QuoteCartProvider");
  return ctx;
}

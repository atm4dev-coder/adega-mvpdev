import React, { createContext, useContext, useState, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addItem = useCallback((product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { productId: product.id, product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

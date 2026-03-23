// Tipos compartilhados para o MVP da Adega

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Customer {
  name: string;
  condominium: string;
  block: string;
  apartment: string;
}

export interface Order {
  code: string;
  customer: Customer;
  items: CartItem[];
  paymentMethod: "pix" | "cash" | "card";
  total: number;
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

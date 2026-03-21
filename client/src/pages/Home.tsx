import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { ShoppingCart, Truck } from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "Cerveja Brahma 350ml",
    description: "Cerveja clara, refrescante",
    price: 3.50,
    category: "Cervejas",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "2",
    name: "Cerveja Skol 350ml",
    description: "Cerveja clara, leve",
    price: 3.50,
    category: "Cervejas",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "3",
    name: "Cerveja Heineken 350ml",
    description: "Cerveja premium importada",
    price: 5.50,
    category: "Cervejas",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "4",
    name: "Vinho Tinto Reserva 750ml",
    description: "Vinho tinto de qualidade",
    price: 35.00,
    category: "Vinhos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/wine-bottle-WXjZg5Xc2AeyGdmgVycZya.webp",
    available: true,
  },
  {
    id: "5",
    name: "Vinho Branco Seco 750ml",
    description: "Vinho branco seco",
    price: 28.00,
    category: "Vinhos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/wine-bottle-WXjZg5Xc2AeyGdmgVycZya.webp",
    available: true,
  },
  {
    id: "6",
    name: "Vodka Smirnoff 750ml",
    description: "Vodka premium",
    price: 45.00,
    category: "Destilados",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "7",
    name: "Whisky Red Label 750ml",
    description: "Whisky escocês",
    price: 85.00,
    category: "Destilados",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "8",
    name: "Cachaça Ypioca 750ml",
    description: "Cachaça tradicional",
    price: 25.00,
    category: "Destilados",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/beer-bottle-LGxyqJgZZ6xHKbwLsSotLx.webp",
    available: true,
  },
  {
    id: "9",
    name: "Refrigerante Coca-Cola 2L",
    description: "Refrigerante de cola",
    price: 8.50,
    category: "Refrigerantes",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/juice-bottle-3oXmhpQRyyy5ev6ebqpVzb.webp",
    available: true,
  },
  {
    id: "10",
    name: "Suco Natural Laranja 1L",
    description: "Suco natural de laranja",
    price: 12.00,
    category: "Sucos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/juice-bottle-3oXmhpQRyyy5ev6ebqpVzb.webp",
    available: true,
  },
  {
    id: "11",
    name: "Água Mineral 1.5L",
    description: "Água mineral natural",
    price: 2.50,
    category: "Águas",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/water-bottle-HrXLdRfARydw6rPxeMY3mF.webp",
    available: true,
  },
  {
    id: "12",
    name: "Chá Gelado Limão 1L",
    description: "Chá gelado sabor limão",
    price: 6.00,
    category: "Bebidas Quentes",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/juice-bottle-3oXmhpQRyyy5ev6ebqpVzb.webp",
    available: true,
  },
  {
    id: "13",
    name: "Amendoim Salgado 200g",
    description: "Amendoim torrado e salgado",
    price: 8.00,
    category: "Petiscos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/snacks-mix-bdstPpwjZv8oQpH5AaV34G.webp",
    available: true,
  },
  {
    id: "14",
    name: "Batata Chips 150g",
    description: "Batata frita crocante",
    price: 6.50,
    category: "Petiscos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/snacks-mix-bdstPpwjZv8oQpH5AaV34G.webp",
    available: true,
  },
  {
    id: "15",
    name: "Castanha de Caju 200g",
    description: "Castanha de caju torrada",
    price: 18.00,
    category: "Petiscos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/snacks-mix-bdstPpwjZv8oQpH5AaV34G.webp",
    available: true,
  },
  {
    id: "16",
    name: "Queijo Meia Lua 100g",
    description: "Queijo crocante",
    price: 7.50,
    category: "Petiscos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663183488622/VD378xfu6QB4Uu8RghDkkT/snacks-mix-bdstPpwjZv8oQpH5AaV34G.webp",
    available: true,
  },
];

const CATEGORIES = ["Todos", "Cervejas", "Vinhos", "Destilados", "Refrigerantes", "Sucos", "Águas", "Bebidas Quentes", "Petiscos"];

export default function Home() {
  const { items, addItem } = useCart();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts =
    selectedCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-foreground">Adega MVP</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/delivery")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Truck className="w-4 h-4" />
              Entregador
            </button>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="md:hidden relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 container py-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Filter */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-border text-foreground hover:border-emerald-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="hidden md:block md:w-80">
          <CartSidebar isOpen={true} onClose={() => {}} />
        </div>
      </div>

      {/* Mobile Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Delivery Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setLocation("/delivery")}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <Truck className="w-5 h-5" />
          Entregador
        </button>
      </div>
    </div>
  );
}

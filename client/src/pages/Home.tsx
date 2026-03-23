import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { ShoppingCart, Truck } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/../../shared/products";

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
            <h1 className="text-2xl font-bold text-foreground">🍺 Adega MVP</h1>
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
              {["Todos", ...CATEGORIES].map((category) => (
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

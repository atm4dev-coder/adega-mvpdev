import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Product } from "@/../../shared/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Indisponível</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-md dark:bg-slate-700">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={!product.available}
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={!product.available}
            >
              +
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.available}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

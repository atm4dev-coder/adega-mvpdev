import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, removeItem, updateQuantity } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setLocation("/checkout");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 md:relative md:max-w-sm md:shadow-none md:border-l md:border-border`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrinho
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground line-clamp-2">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    R$ {item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 text-xs border border-border rounded hover:bg-gray-200 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xs font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2 py-1 text-xs border border-border rounded hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total:</span>
              <span className="text-xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Finalizar Compra
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/../../shared/types";

export default function DeliveryValidation() {
  const [, setLocation] = useLocation();
  const [deliveryCode, setDeliveryCode] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryCode.trim()) {
      toast.error("Por favor, insira o código de entrega");
      return;
    }

    setLoading(true);

    try {
      // Buscar pedido no localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const order = orders.find((o: Order) => o.code === deliveryCode.trim());

      if (order) {
        setFoundOrder(order);
        toast.success("Pedido encontrado!");
      } else {
        toast.error("Código de entrega não encontrado");
        setFoundOrder(null);
      }
    } catch (error) {
      toast.error("Erro ao validar código");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = () => {
    if (foundOrder) {
      // Remover pedido dos pendentes
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = orders.filter((o: Order) => o.code !== foundOrder.code);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      toast.success("Entrega finalizada com sucesso!");
      setDeliveryCode("");
      setFoundOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container max-w-2xl">
        {/* Header */}
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold mb-6">Validação de Entrega</h1>

        {!foundOrder ? (
          <div className="bg-white rounded-lg p-8">
            <form onSubmit={handleValidateCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Código de Entrega
                </label>
                <input
                  type="text"
                  value={deliveryCode}
                  onChange={(e) => setDeliveryCode(e.target.value.toUpperCase())}
                  placeholder="Digite o código de 6 dígitos"
                  maxLength={6}
                  className="w-full px-4 py-3 text-lg text-center tracking-widest border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
              >
                {loading ? "Validando..." : "Validar Código"}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6 text-sm">
              Insira o código de entrega fornecido ao cliente para validar o pedido.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-600">Pedido Encontrado!</h2>
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold text-lg mb-3">Informações do Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nome:</span> {foundOrder.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Condomínio:</span> {foundOrder.customer.condominium}
                  </p>
                  <p>
                    <span className="font-medium">Bloco:</span> {foundOrder.customer.block}
                  </p>
                  <p>
                    <span className="font-medium">Apartamento:</span> {foundOrder.customer.apartment}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold text-lg mb-3">Itens do Pedido</h3>
                <div className="space-y-2 text-sm">
                  {foundOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm">
                  <span className="font-medium">Forma de Pagamento:</span>{" "}
                  {foundOrder.paymentMethod === "pix"
                    ? "PIX"
                    : foundOrder.paymentMethod === "cash"
                      ? "Dinheiro"
                      : "Cartão"}
                </p>
              </div>

              {/* Total */}
              <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Valor a Cobrar</p>
                <p className="text-4xl font-bold text-emerald-600">
                  R$ {foundOrder.total.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setFoundOrder(null);
                    setDeliveryCode("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCompleteDelivery}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirmar Entrega
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

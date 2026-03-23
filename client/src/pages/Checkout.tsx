import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/../../shared/types";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    condominium: "",
    block: "",
    apartment: "",
    paymentMethod: "pix" as const,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }
    if (!formData.condominium.trim()) {
      toast.error("Por favor, insira o nome do condomínio");
      return;
    }
    if (!formData.block.trim()) {
      toast.error("Por favor, insira o número do bloco");
      return;
    }
    if (!formData.apartment.trim()) {
      toast.error("Por favor, insira o número do apartamento");
      return;
    }
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setLoading(true);

    try {
      // Gerar código de entrega (6 dígitos aleatórios)
      const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Construir mensagem do pedido
      const itemsList = items
        .map((item) => `${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2)}`)
        .join("\n");

      const paymentMethodLabel =
        formData.paymentMethod === "pix"
          ? "PIX"
          : formData.paymentMethod === "cash"
            ? "Dinheiro"
            : "Cartão";

      const message = `*Novo Pedido - Adega MVP*

*Cliente:*
Nome: ${formData.name}
Condomínio: ${formData.condominium}
Bloco: ${formData.block}
Apartamento: ${formData.apartment}

*Itens:*
${itemsList}

*Total:* R$ ${total.toFixed(2)}
*Forma de Pagamento:* ${paymentMethodLabel}

*Código de Entrega:* ${deliveryCode}`;

      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(message);

      // Número do WhatsApp configurado
      const whatsappNumber = "5581995378064";

      // Armazenar pedido no localStorage para validação do entregador
      const order: Order = {
        code: deliveryCode,
        customer: {
          name: formData.name,
          condominium: formData.condominium,
          block: formData.block,
          apartment: formData.apartment,
        },
        items: items,
        paymentMethod: formData.paymentMethod,
        total: total,
        createdAt: new Date().toISOString(),
      };
      
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      // Mostrar código de entrega
      toast.success(`Código de entrega: ${deliveryCode}`);
      
      // Limpar carrinho e redirecionar
      clearCart();

      // Redirecionar para home após 3 segundos
      setTimeout(() => {
        setLocation("/");
      }, 3000);
    } catch (error) {
      toast.error("Erro ao enviar pedido");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container max-w-2xl">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao seu carrinho antes de finalizar a compra.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Voltar às Compras
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Condomínio *
                </label>
                <input
                  type="text"
                  name="condominium"
                  value={formData.condominium}
                  onChange={handleInputChange}
                  placeholder="Nome do condomínio"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bloco *
                  </label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleInputChange}
                    placeholder="Ex: A, B, 1, 2"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Apartamento *
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Ex: 101, 202"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Forma de Pagamento *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="pix">PIX</option>
                  <option value="cash">Dinheiro</option>
                  <option value="card">Cartão</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6"
              >
                {loading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Pedido via WhatsApp
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Após enviar o pedido, você será redirecionado para o WhatsApp para confirmar os detalhes com nosso atendimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

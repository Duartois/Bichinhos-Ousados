// src/pages/Checkout.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { cartItems, cartTotal } = useCart();

  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [frete, setFrete] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);

  const subtotal = cartTotal;
  const total =
    frete && typeof frete.valor === "number"
      ? (subtotal + frete.valor).toFixed(2)
      : subtotal.toFixed(2);

  const next = () => {
    if (!user) {
      showNotification("Você precisa estar logado para continuar", "warning");
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    if (step === 1 && cartItems.length === 0) {
      showNotification("Seu carrinho está vazio", "warning");
      return;
    }
    if (step === 2 && !frete) {
      showNotification("Você precisa calcular o frete antes de continuar", "warning");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };


  const back = () => setStep((s) => Math.max(s - 1, 1));

  // Buscar CEP
  const buscarCep = async () => {
    if (address.cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${address.cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress((a) => ({
          ...a,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      } else {
        showNotification("CEP não encontrado", "warning");
      }
    } catch (e) {
      showNotification("Erro ao buscar CEP", "error");
    }
  };

  const calcularFrete = async () => {
    const cepLimpo = (address.cep || "").replace(/\D/g, ""); // só números
    if (cepLimpo.length !== 8) {
      showNotification("Informe um CEP válido", "warning");
      return;
    }

    setLoadingFrete(true);
    try {
      const res = await api.post("/api/calculate-shipping", {
        customerZipCode: cepLimpo,
      });
      setFrete(res.data);
    } catch (err) {
      console.error("Erro frete:", err.response?.data || err.message);
      showNotification("Erro ao calcular frete", "error");
    } finally {
      setLoadingFrete(false);
    }
  };
  // Finalizar compra (Stripe)
  const finalizarCompra = async () => {
    try {
      const items = cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.title,
            images: [item.productImg],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

      if (frete && typeof frete.valor === "number") {
        items.push({
          price_data: {
            currency: "brl",
            product_data: { name: "Frete" },
            unit_amount: Math.round(frete.valor * 100),
          },
          quantity: 1,
        });
      }

      // pega o admin dono do produto (assumindo que todos os itens do carrinho são da mesma loja/admin)
      const adminEmail = cartItems[0]?.email || "default";

      const res = await api.post("/api/stripe-checkout", {
        items,
        address,
        email: user?.email,
        adminId: adminEmail,
      });


      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        showNotification("Erro ao criar checkout no Stripe", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Falha ao processar pagamento", "error");
    }
  };

  return (
    <div className="max-w-5xl section h- mx-auto px-4 py-8">
      {/* Header com steps */}
      <div className="flex items-center justify-center mb-10 gap-8">
        {["Produto", "Endereço", "Resumo"].map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          return (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 font-bold
                ${active ? "bg-cyan-600 text-white border-cyan-600" : "bg-gray-100 text-gray-500 border-gray-300"}`}
              >
                {idx}
              </div>
              <span className={active ? "font-semibold text-cyan-600" : "text-gray-400"}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Conteúdo */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
      >
        {/* Passo 1: Produto */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Package size={20} /> Produtos no carrinho
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                    <img
                      src={item.productImg}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-cyan-600 font-semibold">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-700">
                      R$ {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <p className="text-right font-semibold text-lg mt-4">
                  Subtotal: R$ {subtotal.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Passo 2: Endereço */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <MapPin size={20} /> Endereço de entrega
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="CEP (somente números)"
                value={address.cep}
                maxLength={8}
                onChange={(e) =>
                  setAddress({ ...address, cep: e.target.value.replace(/\D/g, "") })
                }
                onBlur={buscarCep}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Rua"
                value={address.rua}
                onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Número"
                value={address.numero}
                onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Complemento"
                value={address.complemento}
                onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Bairro"
                value={address.bairro}
                onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Cidade"
                value={address.cidade}
                onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Estado"
                value={address.estado}
                onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
            </div>

            {/* Cálculo do frete */}
            <button
              onClick={calcularFrete}
              disabled={loadingFrete}
              className="mt-6 px-5 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
            >
              {loadingFrete ? "Calculando..." : "Calcular Frete"}
            </button>

            {frete && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <p>Opção: {frete.servico}</p>
                <p>Prazo: {frete.prazo}</p>
                <p className="font-bold">
                  Valor:{" "}
                  {typeof frete.valor === "number"
                    ? `R$ ${frete.valor.toFixed(2)}`
                    : frete.valor}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Passo 3: Resumo */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <CreditCard size={20} /> Resumo do pedido
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {cartItems.map((item) => (
                <p key={item.id} className="flex justify-between">
                  <span>
                    {item.title} (x{item.quantity})
                  </span>
                  <span>
                    R$ {(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </p>
              ))}
              {frete && (
                <p className="flex justify-between">
                  <span>Frete ({frete.servico})</span>
                  <span>
                    {typeof frete.valor === "number"
                      ? `R$ ${frete.valor.toFixed(2)}`
                      : frete.valor}
                  </span>
                </p>
              )}
              <hr className="my-2" />
              <p className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>R$ {total}</span>
              </p>
            </div>
            <button
              onClick={finalizarCompra}
              disabled={!frete}
              className="mt-6 w-full px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-bold shadow-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              <div className="flex flex-col items-center">
                <span>Finalizar Compra</span>
                <span className="text-xs font-normal text-gray-100">
                  Checkout 100% seguro com Stripe
                </span>
              </div>
            </button>
          </div>
        )}
      </motion.div>

      {/* Botões de navegação */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={back}
            className="flex items-center gap-2 px-5 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        )}
        {step < 3 && (
          <button
            onClick={next}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Avançar <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;

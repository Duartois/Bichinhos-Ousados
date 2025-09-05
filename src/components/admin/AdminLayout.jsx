// src/components/admin/AdminLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // busca todos os pedidos do Mongo
        const res = await api.post("/api/get-orders", {});
        setOrdersCount(res.data?.length || 0);
      } catch (err) {
        console.error("Erro ao buscar pedidos no layout:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fixa */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 p-6 flex-col">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Painel</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium flex-1">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 hover:text-cyan-600 transition"
          >
            <Package size={18} /> Produtos
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 hover:text-cyan-600 transition"
          >
            <ShoppingCart size={18} />{" "}
            Pedidos{ordersCount > 0 ? ` (${ordersCount})` : ""}
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-2 hover:text-cyan-600 transition"
          >
            <Settings size={18} /> Configurações
          </button>

          <button
            onClick={() => {
              navigate("/"); // ou outra rota que faça sentido, tipo "/home"
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut size={18} /> Sair da Dashboard
          </button>
        </nav>
      </aside>

      {/* Conteúdo dinâmico */}
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
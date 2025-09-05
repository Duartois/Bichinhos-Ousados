import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { LogOut, Package, ShoppingCart } from "lucide-react";

export default function AdminOrders() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");
    if (!user.admin) return navigate("/account");

    const fetchOrders = async () => {
      try {
        const res = await api.post("/api/get-orders", { adminId: user.email });
        setOrders(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 p-6 flex-col">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Painel Admin</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium flex-1">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 hover:text-cyan-600 transition">
            <Package size={18} /> Produtos
          </button>
          <button disabled className="flex items-center gap-2 text-cyan-600 font-semibold">
            <ShoppingCart size={18} /> Pedidos
          </button>
        </nav>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-8 text-[var(--dark-color)]">
          Pedidos
        </h1>

        {loading && <p className="text-gray-500">Carregando pedidos...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">Nenhum pedido encontrado.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Produtos</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t text-sm">
                    <td className="p-3">{order.email}</td>
                    <td className="p-3">
                      {order.products.map((p) => `${p.name} x${p.quantity}`).join(", ")}
                    </td>
                    <td className="p-3">R${order.total}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

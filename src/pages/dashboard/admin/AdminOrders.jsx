import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { Trash } from "lucide-react";
import AdminLayout from "../../../components/admin/AdminLayout";
import ConfirmDialog from "../../../components/ConfirmDialog"; // importa o seu dialog

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      await api.delete(`/api/delete-order/${selectedOrder._id}`);
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrder._id));
    } catch (err) {
      console.error("Erro ao remover pedido:", err);
      alert("Erro ao remover pedido");
    } finally {
      setConfirmOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-gray-50">
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
                    <th className="p-3">Modo</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t text-sm">
                      <td className="p-3">{order.email}</td>
                      <td className="p-3">
                        {order.products.map((p, i) => (
                          <span key={i}>
                            {p.name} x{p.quantity}
                            {i < order.products.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </td>
                      <td className="p-3">R${order.total}</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">{order.testMode ? "Teste" : "Real"}</td>
                      <td className="p-3">
                        {new Date(order.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={confirmOpen}
        message="Tem certeza que deseja excluir este pedido?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
}

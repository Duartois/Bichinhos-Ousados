import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Package, MapPin, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "profile", label: "Meu Perfil", icon: <User size={18} /> },
  { id: "orders", label: "Pedidos", icon: <Package size={18} /> },
  { id: "addresses", label: "Endereços", icon: <MapPin size={18} /> },
  { id: "settings", label: "Configurações", icon: <Settings size={18} /> },
];

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
};

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto py-12 px-4 grid md:grid-cols-[250px_1fr] gap-8"
    >
      {/* Sidebar */}
      <aside className="bg-white rounded-2xl shadow-md p-4 space-y-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition ${activeTab === tab.id
                ? "bg-cyan-600 text-white shadow"
                : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </aside>

      {/* Content */}
      <section className="bg-white rounded-2xl shadow-md p-6 min-h-[250px]">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-semibold mb-4">Olá, {user?.name} 👋</h2>
              <p className="text-gray-600">
                Aqui você pode gerenciar seus dados pessoais e informações de conta.
              </p>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-semibold mb-4">Meus Pedidos</h2>
              <p className="text-gray-600">Você ainda não possui pedidos.</p>
            </motion.div>
          )}

          {activeTab === "addresses" && (
            <motion.div
              key="addresses"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-semibold mb-4">Meus Endereços</h2>
              <p className="text-gray-600">Nenhum endereço cadastrado ainda.</p>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-semibold mb-4">Configurações</h2>
              <p className="text-gray-600">Ajuste suas preferências da conta aqui.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
};

export default UserDashboard;

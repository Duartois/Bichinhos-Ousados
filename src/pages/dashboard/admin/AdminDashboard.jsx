import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { PlusCircle, Search, Package, ShoppingCart, Settings, PackageX, LogOut } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { useConfirm } from "../../../context/ConfirmContext";
import AdminLayout from "../../../components/admin/AdminLayout";



const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { confirm } = useConfirm();


    useEffect(() => {
        if (!user) return navigate("/login");
        if (!user.admin) return navigate("/account");

        const fetchProducts = async () => {
            try {
                const prodRes = await api.post("/api/get-products", { email: user.email });
                setProducts(prodRes.data || []);
                const orderRes = await api.post("/api/get-orders", { adminId: user.email });
                setOrders(orderRes.data || []);
            } catch {
                showNotification("Não foi possível carregar seus produtos. Tente novamente em alguns minutos.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [user, navigate, showNotification]);

    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // opcional: rolar para o topo
        }
    };
    return (
        <AdminLayout>
        <div className="flex min-h-screen bg-gray-50">
            {/* Conteúdo principal */}
            <Motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 p-4 sm:p-6 md:p-10 w-full max-w-full overflow-x-hidden"
            >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-5xl text-center font-extrabold text-[var(--dark-color)]">
                        Meus Produtos
                    </h1>
                    <button
                        onClick={() => navigate("/add-product")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--first-color)] hover:bg-[var(--first-color-alt)] text-[var(--dark-color)] px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow font-medium transition"
                    >
                        <PlusCircle size={20} /> Novo Produto
                    </button>
                </div>
                {/* Busca */}
                <div className="relative w-full sm:w-2/3 md:w-1/2 mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, categoria ou marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-cyan-300 outline-none text-gray-700"
                    />
                </div>

                {/* Loading */}
                {loading && <p className="text-gray-500">Carregando produtos...</p>}

                {/* Lista */}
                {!loading && paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                            <AnimatePresence>
                                {paginatedProducts.map((product) => (
                                    <Motion.div
                                        key={product.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col border border-[var(--first-color-alt)]"
                                    >
                                        <div className="relative w-full h-60 md:h-48 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--dark-color)] truncate">
                                                        {product.name}
                                                    </h2>

                                                    {product.draft && (
                                                        <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-medium">
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">
                                                    {product.category}
                                                </p>
                                                <p className="font-display text-lg sm:text-xl font-bold text-[var(--first-color)] mt-3">
                                                    R${product.price}
                                                </p>
                                            </div>
                                            <div className="flex gap-3 mt-5">
                                                <button
                                                    onClick={() => navigate(`/add-product?id=${product.id}`)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-[var(--first-color-alt)] transition"
                                                >
                                                    <Pencil size={16} /> Editar
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const ok = await confirm("Tem certeza que deseja excluir este produto?");
                                                        if (ok) {
                                                            await api.post("/api/delete-product", { id: product.id });
                                                            setProducts(products.filter((p) => p.id !== product.id));
                                                            showNotification("Produto excluído com sucesso!", "success");
                                                        }
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                >
                                                    <Trash2 size={16} /> Excluir
                                                </button>

                                            </div>
                                        </div>
                                    </Motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {/* Paginação refinada */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700 disabled:opacity-40 transition-all duration-300"
                                >
                                    ←
                                </button>

                                {Array.from({ length: totalPages }).map((_, index) => {
                                    const page = index + 1;

                                    if (page <= 3 || page === totalPages) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${currentPage === page
                                                    ? "bg-cyan-600 text-white shadow-lg hover:bg-cyan-700"
                                                    : "bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    }

                                    if (
                                        page >= currentPage - 1 &&
                                        page <= currentPage + 1 &&
                                        page < totalPages
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${currentPage === page
                                                    ? "bg-cyan-600 text-white shadow-lg hover:bg-cyan-700"
                                                    : "bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    }

                                    if (
                                        (page === 4 && currentPage > 4) ||
                                        (page === totalPages - 1 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span key={page} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }

                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700 disabled:opacity-40 transition-all duration-300"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    !loading && (
                        <div className="text-center text-gray-500 mt-20">
                            <PackageX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg">Nenhum produto encontrado.</p>
                            <button
                                onClick={() => navigate("/add-product")}
                                className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl shadow-md font-medium transition"
                            >
                                Adicionar Produto
                            </button>
                        </div>
                    )
                )}
            </Motion.main>
        </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

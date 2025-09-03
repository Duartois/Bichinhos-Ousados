import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SellerDashboard = () => {
    const { user } = useAuth();  // ✅ dentro do componente
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (!user.seller) {
            navigate("/account");
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await api.post("/get-products", { email: user.email });
                setProducts(res.data || []);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [user, navigate]);

    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-4">
                Bem-vindo(a), {user?.name || "Vendedor"}
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar produto por nome, categoria ou marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded w-full md:w-1/2"
                />
                <button
                    onClick={() => navigate("/add-product")}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded shadow"
                >
                    Adicionar Produto
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : filteredProducts.length ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded shadow-sm p-4 hover:shadow-md transition"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-40 w-full object-cover rounded mb-2"
                            />
                            <h2 className="font-semibold">{product.name}</h2>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-lg font-bold">R${product.price}</p>
                            <div className="flex gap-2 mt-2 text-sm">
                                <button className="px-2 py-1 border rounded hover:bg-gray-100">
                                    Editar
                                </button>
                                <button className="px-2 py-1 border rounded hover:bg-gray-100 text-red-500">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum produto encontrado.</p>
            )}
        </div>
    );
};

export default SellerDashboard;

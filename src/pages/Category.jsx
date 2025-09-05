import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductCardMini from "../components/ProductCardMini";
import api from "../services/api";
import { useLocation } from "react-router-dom";

// normaliza texto: remove acentos, caixa e espaços
const normalize = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();


const Category = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.post("/api/get-products");
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchTerm(search);
  }, [location.search]);
  // 🔎 Filtro de busca
  useEffect(() => {
    const term = normalize(searchTerm);

    // sem termo → mantém a ordem original
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    // calcula “relevância” para cada produto
    const scoreOf = (p) => {
      const name = normalize(p.name || p.title || "");
      const cat = normalize(p.category || "");

      if (!name && !cat) return 0;

      if (name.startsWith(term)) return 4;   // mais relevante
      if (cat.startsWith(term)) return 3;
      if (name.includes(term)) return 2;
      if (cat.includes(term)) return 1;
      return 0;                                // não bate
    };

    const matches = [];
    const others = [];

    for (const p of products) {
      const s = scoreOf(p);
      if (s > 0) matches.push({ p, s });
      else others.push(p);
    }

    // ordena por relevância (desc) e usa nome como desempate
    matches.sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s;
      const an = normalize(a.p.name || a.p.title || "");
      const bn = normalize(b.p.name || b.p.title || "");
      return an.localeCompare(bn);
    });

    // primeiro os que batem, depois o restante
    setFilteredProducts([...matches.map(m => m.p), ...others]);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className="section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        {/* Header catálogo */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-9">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent leading-tight pb-1">
            Catálogo
          </h2>
          <div className="flex-1 flex justify-center md:justify-end mt">
            <input
              type="text"
              placeholder="🔍 Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 h-12 rounded-full border border-gray-200 px-5 text-sm sm:text-base shadow-sm 
             focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
            />
          </div>
          <p className="text-gray-500 text-sm md:ml-4 text-center md:text-right italic">
            Mostrando{" "}
            <span className="text-cyan-600 font-semibold">
              {filteredProducts.length}
            </span>{" "}
            produtos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10">
          {/* Lista de produtos */}
          <div className="products__container grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {loading ? (
              <p>Carregando...</p>
            ) : currentProducts.length === 0 ? (
              <p className="text-gray-500">Nenhum produto encontrado.</p>
            ) : (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} isCatalog />
              ))
            )}
          </div>

          {/* Sidebar com destaques */}
          <aside className="hidden lg:block">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-cyan-500 pb-2 text-gray-800 tracking-wide">
              ⭐ Mais Procurados
            </h3>
            <div className="flex flex-col gap-4">
              {products.slice(0, 6).map((product) => (
                <ProductCardMini key={product.id} product={product} />
              ))}
            </div>
          </aside>
        </div>

        {/* Paginação refinada */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700 disabled:opacity-40 transition-all duration-300"

            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              // mostra primeiras 3 páginas
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

              // páginas intermediárias próximas da atual
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

              // reticências
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
      </div>
    </section>
  );
};

export default Category;

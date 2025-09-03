import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import Cart from "../pages/Cart";
import ProductCardMini from "../components/ProductCardMini";
import api from "../services/api";
import UserMenu from "../components/UserMenu";

const normalize = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  const { cartCount } = useCart();
  const isLoggedIn = !!sessionStorage.getItem("user");

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  const navigate = useNavigate();

  const handleCloseMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuClosing(false);
      setMenuOpen(false);
    }, 350);
  };

  const handleCloseSearch = () => {
    setSearchClosing(true);
    setTimeout(() => {
      setSearchClosing(false);
      setSearchOpen(false);
      setQuery(""); // 🔹 limpa o campo de busca
    }, 350);
  };


  // ==== clickoutside ====
  useEffect(() => {
    const handleClick = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        handleCloseMenu();
      }
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        handleCloseSearch();
      }
      if (desktopOpen && desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) {
        setDesktopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, searchOpen, desktopOpen]);

  // ==== busca produtos ====
  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 3) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.post("/get-products");
        const all = res.data || [];

        const term = normalize(query);
        const filtered = all.filter((p) => {
          const name = normalize(p.name || p.title || "");
          const cat = normalize(p.category || "");
          return name.includes(term) || cat.includes(term);
        });

        setResults(filtered.slice(0, 5));
      } catch (err) {
        console.error("Erro na busca:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <header className="w-full shadow-md relative z-[150]">
      {/* ===== Faixa branca ===== */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile: menu + lupa */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-gray-700 hover:text-[var(--first-color)]">☰</button>
            <button onClick={() => setSearchOpen(true)} className="text-gray-700 hover:text-[var(--first-color)]">
              <Search size={22} />
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img  />
          </Link>

          {/* Search desktop */}
          <div ref={desktopSearchRef} className="hidden md:block flex-grow max-w-xl mx-6 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!query.trim()) return;
                navigate(`/category?search=${encodeURIComponent(query.trim())}`);
              }}
              className="flex"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setDesktopOpen(true)}
                placeholder="Buscar produtos..."
                className="w-full h-10 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--first-color)] outline-none transition"
              />
              <button type="submit" className="ml-[-36px]">
                <Search size={20} className="text-gray-600" />
              </button>
            </form>

            {(desktopOpen && query.length >= 3) && (
              <div className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fadeIn">
                {loading ? (
                  <div className="p-4 flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                    <span className="text-sm text-gray-500">Procurando...</span>
                  </div>
                ) : (
                  <>
                    {results.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto divide-y">
                        {results.map((p) => <ProductCardMini key={p.id} product={p} />)}
                        <button
                          onClick={() => navigate(`/category?search=${encodeURIComponent(query.trim())}`)}
                          className="w-full text-center py-2 text-cyan-600 font-semibold hover:bg-gray-50 transition"
                        >
                          Ver mais "{query}"
                        </button>
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-gray-500">Nenhum produto encontrado.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Ícones */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <UserMenu />
            <button onClick={() => setCartOpen(true)} className="relative text-gray-700 hover:text-[var(--first-color)]">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Faixa azul ===== */}
      <div className="bg-[var(--first-color)] text-white">
        <div className="container mx-auto px-4 flex justify-center">
          <ul className="hidden md:flex gap-10 font-semibold tracking-wide py-3">
            <li><Link to="/" className="hover:text-[var(--light-color)]">Início</Link></li>
            <li><Link to="/category" className="hover:text-[var(--light-color)]">Catálogo</Link></li>
            <li><Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-[var(--light-color)]">Minha Conta</Link></li>
            <li>
              <Link to="/404" className="relative hover:text-[var(--light-color)]">
                Receitas
                <span className="absolute ml-1 z-0 text-[7px] uppercase font-medium px-1 py-[0.5px] rounded border border-[var(--first-color)] bg-white text-[var(--first-color)] opacity-80 group-hover:opacity-100 transition">
                  beta
                </span>
              </Link>
            </li>
            <li>
              <Link to="/404" className="relative hover:text-[var(--light-color)]">
                Cursos
                <span className="absolute ml-1 z-0 text-[7px] uppercase font-medium px-1 py-[0.5px] rounded border border-[var(--first-color)] bg-white text-[var(--first-color)] opacity-80 group-hover:opacity-100 transition">
                  beta
                </span>
              </Link>
            </li>
            <li>
              <Link to="/404" className="relative hover:text-[var(--light-color)]">
                Lojinha
                <span className="absolute ml-1 z-0 text-[7px] uppercase font-medium px-1 py-[0.5px] rounded border border-[var(--first-color)] bg-white text-[var(--first-color)] opacity-80 group-hover:opacity-100 transition">
                  beta
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* ===== MENU MOBILE =====*/}
      {(menuOpen || menuClosing) && (
        <div className="fixed inset-0 z-[300] flex">
          {/* Overlay sem blur */}
          <div
            className={`absolute inset-0 bg-black/40 ${menuClosing ? "animate-fadeOut" : "animate-fadeIn"
              }`}
            onClick={handleCloseMenu}
          />

          {/* Drawer vindo da esquerda */}
          <div
            ref={menuRef}
            className={`w-[80%] sm:w-[320px] h-full bg-white shadow-2xl flex flex-col
        ${menuClosing ? "animate-slideOutLeft" : "animate-slideInLeft"}`}
          >
            {/* Logo + Fechar */}
            <div className="p-6 border-b flex items-center justify-between">
              <img src="/assets/img/logo.svg" alt="logo" className="h-12" />
              <button
                onClick={handleCloseMenu}
                className="text-2xl text-gray-600 hover:text-cyan-600"
              >
                ✕
              </button>
            </div>

            {/* Links principais */}
            <nav className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-6 text-gray-800 font-medium">
                <li>
                  <Link to="/" onClick={handleCloseMenu}>
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/category" onClick={handleCloseMenu}>
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    to={isLoggedIn ? "/dashboard" : "/login"}
                    onClick={handleCloseMenu}
                  >
                    Minha Conta
                  </Link>
                </li>

                {/* Extras estilizados */}
                <li>
                  <Link to="/404" onClick={handleCloseMenu} className="flex items-center gap-1.5 group">
                    Receitas
                    <span className="text-[9px] uppercase font-semibold px-1.5 py-[1px] rounded-full border bg-[var(--first-color)] text-white tracking-wide opacity-80 group-hover:opacity-100 transition">
                      beta
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/404" onClick={handleCloseMenu} className="flex items-center gap-1.5 group">
                    Cursos
                    <span className="text-[9px] uppercase font-semibold px-1.5 py-[1px] rounded-full border bg-[var(--first-color)] text-white tracking-wide opacity-80 group-hover:opacity-100 transition">
                      beta
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/404" onClick={handleCloseMenu} className="flex items-center gap-1.5 group">
                    Lojinha
                    <span className="text-[9px] uppercase font-semibold px-1.5 py-[1px] rounded-full border bg-[var(--first-color)] text-white tracking-wide opacity-80 group-hover:opacity-100 transition">
                      beta
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Rodapé dinâmico */}
            <div className="border-t px-6 py-4">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={handleCloseMenu}
                  className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 font-medium"
                >
                  <User size={20} />
                  Minha Conta
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={handleCloseMenu}
                  className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 font-medium"
                >
                  <User size={20} />
                  Login / Cadastro
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== SEARCH MOBILE =====*/}
      {(searchOpen || searchClosing) && (
        <div className="fixed inset-0 z-[300] flex flex-col">
          {/* Overlay com blur */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${searchClosing ? "animate-fadeOut" : "animate-fadeIn"
              }`}
            onClick={handleCloseSearch}
          />
          <div
            ref={searchRef}
            className={`relative w-full bg-white shadow-2xl flex flex-col z-[310]
    ${searchClosing ? "animate-slideUp" : "animate-slideDown"}`}
          >
            <div className="flex items-center px-4 py-3 gap-2">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full h-11 px-4 rounded-full border border-gray-200 focus:ring-2 focus:ring-[var(--first-color)] outline-none"
              />
              <button onClick={handleCloseSearch} className="text-gray-600 hover:text-[var(--first-color)]">
                <ChevronUp size={24} />
              </button>
            </div>

            {/* Só aparece o bloco branco quando tem query */}
            {query.length >= 3 && (
              <div className="flex-1 overflow-y-auto divide-y bg-white">
                {loading ? (
                  <div className="p-4 flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                    <span className="text-sm text-gray-500">Procurando...</span>
                  </div>
                ) : (
                  <>
                    {results.length > 0 ? (
                      <>
                        {results.map((p) => <ProductCardMini key={p.id} product={p} />)}
                        <button
                          onClick={() => {
                            handleCloseSearch();
                            navigate(`/category?search=${encodeURIComponent(query.trim())}`);
                          }}
                          className="w-full text-center py-2 text-cyan-600 font-semibold hover:bg-gray-50"
                        >
                          Ver mais "{query}"
                        </button>
                      </>
                    ) : (
                      <p className="p-4 text-sm text-gray-500">Nenhum produto encontrado.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Carrinho */}
      <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />
    </header>
  );
};

export default Header;

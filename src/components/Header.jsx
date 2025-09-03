import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "../pages/Cart";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closingMenu, setClosingMenu] = useState(false); // 🔹 estado para animação do menu
  const [cartOpen, setCartOpen] = useState(false);
  const [userPopup, setUserPopup] = useState(false);
  const { cartCount } = useCart();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setUserPopup(false);
      }
    };
    if (userPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userPopup]);

  const handleCloseMenu = () => {
    setClosingMenu(true);
    setTimeout(() => {
      setClosingMenu(false);
      setMenuOpen(false);
    }, 350); // tempo da animação
  };
  const isLoggedIn = !!sessionStorage.getItem("user");

  return (
    <header className="shadow-sm bg-white z-[200]">
      {/* Top bar */}
      <div className="bg-gray-100 border-b text-[10px] sm:text-xs md:text-sm py-1 sm:py-2">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-0.5 sm:gap-2">
          <div className="flex gap-2 text-gray-600">
            <span>(11) 98111-7150</span>
            <span>| Nosso Contato</span>
          </div>
          <p className="text-cyan-700 font-medium">Ofertas imperdíveis</p>
          <Link to="/login" className="text-cyan-600 hover:underline">
            Log In / Sign up
          </Link>
        </div>
      </div>


      {/* Nav */}
      <nav className="container flex justify-between items-center py-2 sm:py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/img/logo.svg"
            alt="logo"
            className="w-28 sm:w-36"
          />

        </Link>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-8 text-gray-800 font-medium">
          <li><Link to="/" className="hover:text-cyan-600">Inicio</Link></li>
          <li><Link to="/category" className="hover:text-cyan-600">Catálogo</Link></li>
          <li>
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="hover:text-cyan-600"
            >
              Minha Conta
            </Link>
          </li>
          <li><Link to="/login" className="hover:text-cyan-600">Login</Link></li>
        </ul>

        {/* User + Cart */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <div className="relative group">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const term = e.target.search.value;
                  window.location.href = `/category?search=${encodeURIComponent(term)}`;
                }}
                className="relative group"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar produtos..."
                  className="h-11 w-11 group-hover:w-80 focus:w-80 rounded-full border border-gray-200 pr-11 text-sm 
               focus:ring-2 focus:ring-cyan-500 transition-all duration-500 ease-in-out 
               group-hover:pl-4 focus:pl-4 bg-white focus:outline-none"
                />
                <FiSearch
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all"
                />
              </form>

            </div>
          </div>
          {/* User */}
          <div className="relative" ref={popupRef}>
            <IoPersonCircleOutline
              id="user-icon"
              className="text-xl sm:text-2xl md:text-3xl cursor-pointer text-gray-700 hover:text-cyan-600"
              onClick={() => setUserPopup(!userPopup)}
            />
            {userPopup && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-cyan-600 rounded-lg shadow-lg p-4 z-[100]">
                <p className="mb-3 text-gray-800">Olá, visitante!</p>
                <Link
                  to="/login"
                  className="block bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
                  onClick={() => setUserPopup(false)}
                >
                  Entrar
                </Link>
              </div>
            )}
          </div>

          {/* Carrinho */}
          <div className="relative flex items-center">
            <button
              id="cart-icon"
              aria-label="Abrir carrinho"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center"
            >
              <FiShoppingCart className="text-lg sm:text-xl md:text-2xl text-gray-700 hover:text-cyan-600 transition" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-cyan-600 text-white min-w-[16px] h-4 px-[5px] flex items-center justify-center text-[10px] font-bold rounded-full shadow`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Btn */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {(menuOpen || closingMenu) && (
        <div className="fixed inset-0 z-[250] flex">
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 ${closingMenu ? "animate-fadeOut" : "animate-fadeIn"
              }`}
            onClick={handleCloseMenu}
          />
          {/* Drawer */}
          <div
            className={`ml-auto w-full h-full bg-white shadow-2xl p-6 ${closingMenu ? "animate-slideOut" : "animate-slideIn"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <img
                src="/assets/img/logo.svg"
                alt="logo"
                className="w-24 sm:w-32 md:w-36"
              />

              <button onClick={handleCloseMenu}>
                <FiX className="text-2xl" />
              </button>
            </div>
            <ul className="flex flex-col gap-4 text-gray-800 font-medium">
              <li><Link to="/" onClick={handleCloseMenu}>Inicio</Link></li>
              <li><Link to="/category" onClick={handleCloseMenu}>Catálogo</Link></li>
              <li>
                <Link
                  to={isLoggedIn ? "/dashboard" : "/login"}
                  onClick={handleCloseMenu}
                >
                  Minha Conta
                </Link>
              </li>
              <li><Link to="/login" onClick={handleCloseMenu}>Login</Link></li>
            </ul>
          </div>
        </div>
      )}

      {/* Carrinho */}
      <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />
    </header>
  );
};

export default Header;

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "../pages/Cart";
import { IoPersonCircleOutline } from "react-icons/io5";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userPopup, setUserPopup] = useState(false);
  const { cartCount } = useCart();

  const popupRef = useRef(null);

  // Fecha popup do usuário ao clicar fora
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

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header__top">
        <div className="header__container">
          <div className="header__contact">
            <span>(11) 98111-7150</span>
            <span className="ml-2">Nosso Contato</span>
          </div>
          <p className="header__alert-news">Ofertas imperdíveis</p>
          <Link to="/login" className="header__top-action">
            Log In / Sign up
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav container">
        {/* Logo */}
        <Link to="/" className="nav__logo">
          <img src="/assets/img/logo.svg" alt="logo" className="nav__logo-img" />
        </Link>

        {/* Menu Desktop */}
        <ul className="nav__list hidden md:flex">
          <li><Link to="/" className="nav__link">Inicio</Link></li>
          <li><Link to="/category" className="nav__link">Catálogo</Link></li>
          <li><Link to="/dashboard" className="nav__link">Minha Conta</Link></li>
          <li><Link to="/login" className="nav__link">Login</Link></li>
        </ul>

        {/* Search bar */}
        <div className="header__search hidden md:block">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="form__input"
          />
          <button className="search__btn" aria-label="Buscar">🔍</button>
        </div>

        {/* User + Cart */}
        <div className="header__user-actions flex gap-4 items-center">
          {/* Usuário */}
          <div className="header__action-btn relative" ref={popupRef}>
            <IoPersonCircleOutline
              id="user-icon"
              className="text-3xl cursor-pointer text-black hover:text-cyan-800"
              onClick={() => setUserPopup(!userPopup)}
            />
            {userPopup && (
              <div className="user-icon-popup absolute top-full right-0 mt-2 w-60 bg-white border border-[var(--first-color)] rounded-md shadow p-4 z-[100]">
                <p className="mb-3 text-gray-800">Olá, visitante!</p>
                <Link
                  to="/login"
                  className="block first-color text-white px-4 py-2 rounded hover:opacity-90 transition"
                  onClick={() => setUserPopup(false)}
                >
                  Entrar
                </Link>
              </div>
            )}
          </div>

          {/* Carrinho */}
          <div className="header__action-btn relative">
            <button
              id="cart-icon"
              aria-label="Abrir carrinho"
              onClick={() => setCartOpen(true)}
            >
              <img
                src="/assets/img/icon-cart.svg"
                alt="Carrinho"
                className="w-6 h-6"
              />
            </button>
            {cartCount > 0 && (
              <span className="count">{cartCount}</span>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <button
          className="nav__toggle md:hidden"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </nav>

      {/* Overlay Mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99]"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="nav__menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nav__menu-top">
              <img src="/assets/img/logo.svg" alt="logo" className="w-28" />
              <button
                className="nav__close"
                aria-label="Fechar menu"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
              <li><Link to="/category" onClick={() => setMenuOpen(false)}>Catálogo</Link></li>
              <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Minha Conta</Link></li>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            </ul>
          </div>
        </div>
      )}

      {/* Carrinho Lateral */}
      <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />
    </header>
  );
};

export default Header;

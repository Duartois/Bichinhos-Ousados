import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiX } from "react-icons/fi";

const Cart = ({ cartOpen, setCartOpen }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const cartRef = useRef(null);

  // 🔹 estado para controlar a animação de saída
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        handleClose();
      }
    };
    if (cartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen]);

  // 🔹 Função que dispara a animação de saída
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setCartOpen(false);
    }, 350); // mesmo tempo da animação CSS
  };

  // 🔹 Renderiza enquanto estiver aberto OU em processo de fechamento
  if (!cartOpen && !closing) return null;

  return (
    <div className="fixed inset-0 z-[300] flex">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
          closing ? "animate-fadeOut" : "animate-fadeIn"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        ref={cartRef}
        className={`ml-auto w-full sm:w-[400px] h-full bg-white shadow-2xl flex flex-col ${
          closing ? "animate-slideOut" : "animate-slideIn"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-cyan-600">Seu Carrinho</h2>
          <button onClick={handleClose} aria-label="Fechar">
            <FiX className="text-2xl text-gray-600 hover:text-cyan-600" />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto divide-y">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Seu carrinho está vazio.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 px-4">
                {/* Imagem clicável */}
                <Link
                  to={`/product/${item.id}`}
                  onClick={handleClose}
                  className="shrink-0"
                >
                  <img
                    src={item.productImg}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded border hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/product/${item.id}`}
                    onClick={handleClose}
                    className="font-medium text-gray-800 hover:text-cyan-600 transition block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-cyan-600">
                    R${Number(item.price).toFixed(2)}
                  </p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 mt-1 border rounded text-center text-sm"
                  />
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-cyan-600">
                Total: R${Number(cartTotal).toFixed(2)}
              </p>
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Limpar
              </button>
            </div>
            <Link
              to="/checkout"
              onClick={handleClose}
              className="block w-full bg-cyan-600 text-white text-center py-3 rounded-lg hover:bg-cyan-700 transition"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

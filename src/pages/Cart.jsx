import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = ({ cartOpen, setCartOpen }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useCart();
  const cartRef = useRef(null);

  // Fecha o carrinho ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null; // Não renderiza se fechado

  return (
    <aside
      ref={cartRef}
      className={`cart ${cartOpen ? "active" : ""}`}
      aria-hidden={!cartOpen}
    >
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-[var(--first-color)]">
          Seu Carrinho
        </h2>
        <button
          id="close-cart"
          aria-label="Fechar carrinho"
          onClick={() => setCartOpen(false)}
        >
          ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="table__container mb-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Qtd</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.productImg}
                        alt={item.title}
                        className="table__img"
                      />
                    </td>
                    <td className="font-medium">{item.title}</td>
                    <td>R${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="cart-quantity"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-remove"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border-t pt-3">
            <p className="font-semibold text-[var(--first-color)]">
              Total: R${cartTotal.toFixed(2)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Limpar
              </button>
              <Link
                to="/checkout"
                className="px-3 py-2 bg-[var(--first-color)] text-white rounded hover:opacity-90"
                onClick={() => setCartOpen(false)}
              >
                Finalizar
              </Link>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Cart;


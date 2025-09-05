import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // importa contexto de auth

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, ready } = useAuth(); // agora usamos também o ready
  const storageKey = user?.email ? `cart_${user.email}` : "cart_guest";

  const [cartItems, setCartItems] = useState([]);

  // Carrega carrinho do usuário logado
  useEffect(() => {
    if (!ready) return; // só executa depois que AuthContext estiver pronto

    if (!storageKey) {
      setCartItems([]); // se não tiver usuário logado, limpa carrinho
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  }, [ready, storageKey]);

  // Salva carrinho no localStorage vinculado ao usuário
  useEffect(() => {
    if (storageKey && ready) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, storageKey, ready]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    if (storageKey) localStorage.removeItem(storageKey);
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

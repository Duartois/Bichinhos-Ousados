import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Success = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="sc-container">
      <img src="/assets/img/success.png" alt="Compra concluída" />

      <h1>Compra Concluída!</h1>

      <p>
        Obrigado pela sua compra. Você receberá a confirmação no seu e-mail
        e poderá acompanhar o pedido na sua conta.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/" className="sc-btn">Voltar para a loja</Link>
        <Link to="/orders" className="sc-btn">Ver meus pedidos</Link>
      </div>
    </div>
  );
};

export default Success;

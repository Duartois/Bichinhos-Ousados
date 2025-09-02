import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="sc-container">
      <img src="/assets/img/cancel.png" alt="Pagamento cancelado" />

      <h1>Pagamento Cancelado</h1>

      <p>
        Seu pedido foi cancelado. Você pode revisar os dados e tentar novamente.
      </p>

      <Link to="/checkout" className="sc-btn">
        Tentar novamente
      </Link>
    </div>
  );
};

export default Cancel;

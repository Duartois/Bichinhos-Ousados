import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer__container grid">
        <div className="footer__content">
          <Link to="/" className="footer__logo">
            <img src="/assets/img/logo.svg" alt="logo" className="footer__logo-img" />
          </Link>

          <h4 className="footer__subtitle">Contato</h4>
          <p className="footer__description">
            <span>Endereço:</span> Rua Capituba, 183 - 03346030, São Paulo
          </p>
          <p className="footer__description">
            <span>Phone:</span> (11) 98111-7150
          </p>
          <p className="footer__description">
            <span>Hora:</span> 08:00 - 18-00, seg - sab
          </p>

          <div className="footer__social">
            <h4 className="footer__subtitle">Follow Me</h4>

            <div className="footer__social-links flex">
              <a href="#"><img src="/assets/img/icon-facebook.svg" alt="facebook" className="footer__social-icon" /></a>
              <a href="#"><img src="/assets/img/icon-twitter.svg" alt="twitter" className="footer__social-icon" /></a>
              <a href="#"><img src="/assets/img/icon-instagram.svg" alt="instagram" className="footer__social-icon" /></a>
              <a href="#"><img src="/assets/img/icon-pinterest.svg" alt="pinterest" className="footer__social-icon" /></a>
              <a href="#"><img src="/assets/img/icon-youtube.svg" alt="youtube" className="footer__social-icon" /></a>
            </div>
          </div>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Informações</h3>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">About Us</a></li>
            <li><a href="#" className="footer__link">Informções de Entrega</a></li>
            <li><Link to="/privacy" className="footer__link">Política de Privacidade</Link></li>
            <li><Link to="/terms" className="footer__link">Termos e Condições</Link></li>
            <li><a href="#" className="footer__link">Entre em Contato</a></li>
            <li><a href="#" className="footer__link">Centro de Suporte</a></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Relacionados</h3>
          <ul className="footer__links">
            <li><Link to="/login" className="footer__link">Entrar</Link></li>
            <li><Link to="/cart" className="footer__link">Ver Carrinho</Link></li>
            <li><Link to="/wishlist" className="footer__link">Minha Lista</Link></li>
            <li><Link to="/orders" className="footer__link">Acompanhar Pedido</Link></li>
            <li><a href="#" className="footer__link">Ajuda</a></li>
            <li><Link to="/orders" className="footer__link">Pedido</Link></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Pagamento Seguro</h3>
          <img src="/assets/img/payment-method.png" alt="pagamentos" className="payment__img" />
        </div>
      </div>

      <div className="footer__bottom">
        <p className="copyright">&copy; 2023 Evera. All rights reserved</p>
        <span className="designer">Designed by Matheus Duarte</span>
      </div>
    </footer>
  );
};

export default Footer;

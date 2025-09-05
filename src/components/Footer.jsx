import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="container mx-auto px-6 py-10 grid gap-10 md:grid-cols-4 text-sm">
        {/* Logo + Contato */}
        <div>
          <Link to="/" className="flex items-center mb-4">
            <img src="/assets/img/Logo.png" alt="logo" className="h-10" />
          </Link>
          <h4 className="font-semibold text-gray-800 mb-2">Contato</h4>
          <p className="text-gray-600">Rua Capituba, 183 - São Paulo</p>
          <p className="text-gray-600">(11) 98111-7150</p>
          <p className="text-gray-600">08:00 - 18:00, seg - sáb</p>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Redes Sociais</h4>
            <div className="flex gap-3 text-gray-600">
              <a href="#" className="hover:text-cyan-600"><Facebook size={20} /></a>
              <a href="#" className="hover:text-cyan-600"><Twitter size={20} /></a>
              <a href="#" className="hover:text-cyan-600"><Instagram size={20} /></a>
              <a href="#" className="hover:text-cyan-600"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Informações</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Informações de Entrega</a></li>
            <li><Link to="/privacy">Política de Privacidade</Link></li>
            <li><Link to="/terms">Termos e Condições</Link></li>
            <li><a href="#">Entre em Contato</a></li>
            <li><a href="#">Centro de Suporte</a></li>
          </ul>
        </div>

        {/* Relacionados */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Relacionados</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/cart">Ver Carrinho</Link></li>
            <li><Link to="/wishlist">Minha Lista</Link></li>
            <li><Link to="/orders">Acompanhar Pedido</Link></li>
            <li><a href="#">Ajuda</a></li>
          </ul>
        </div>

        {/* Pagamento */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Pagamento Seguro</h3>
          <img
            src="/assets/img/payment-method.png"
            alt="Métodos de Pagamento"
            className="h-10 mt-2"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Matheus Duarte. Todos os direitos reservados.</p>
        <p className="text-xs">Design por Matheus Duarte</p>
      </div>
    </footer>
  );
};

export default Footer;

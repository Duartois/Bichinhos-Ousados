import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="login-register__container">
      {/* CADASTRO */}
      <div className="register">
        <h2 className="auth__title">Cadastrar</h2>

        <form className="auth__form" autoComplete="on">
          <div>
            <label htmlFor="name" className="sr-only">Nome completo</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form__input"
              placeholder="Nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form__input"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-pass" className="sr-only">Senha</label>
            <input
              id="reg-pass"
              name="password"
              type="password"
              className="form__input"
              placeholder="Senha"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-pass2" className="sr-only">Confirmar senha</label>
            <input
              id="reg-pass2"
              name="password_confirm"
              type="password"
              className="form__input"
              placeholder="Confirmar senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-sm w-full mt-2">Registrar</button>
        </form>

        <p className="auth__hint">
          Já tem conta? <Link to="/login" className="auth__link">Fazer login</Link>
        </p>
      </div>

      {/* BLOCO LATERAL (opcional) */}
      <div className="login">
        <h2 className="auth__title">Vantagens</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Acompanhe seus pedidos</li>
          <li>Gerencie endereços</li>
          <li>Salve produtos na wishlist</li>
        </ul>
      </div>
    </section>
  );
};

export default Register;

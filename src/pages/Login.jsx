import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="login-register__container">
      {/* LOGIN */}
      <div className="login">
        <h2 className="auth__title">Entrar</h2>

        <form className="auth__form" autoComplete="on">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form__input"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form__input"
              placeholder="Senha"
              required
            />
          </div>

          <div className="auth__actions">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-sky-600" /> Lembrar-me
            </label>
            <a href="#" className="auth__link">Esqueci minha senha</a>
          </div>

          <button type="submit" className="btn btn-sm w-full mt-2">Login</button>
        </form>

        <p className="auth__hint">
          Novo por aqui? <Link to="/register" className="auth__link">Crie sua conta</Link>
        </p>
      </div>

      {/* BLOCO LATERAL (opcional) */}
      <div className="register">
        <h2 className="auth__title">Ainda não tem conta?</h2>
        <p className="text-gray-600 mb-4">
          Cadastre-se para acompanhar pedidos e salvar produtos.
        </p>
        <Link to="/register" className="btn btn-sm w-full">Criar conta</Link>
      </div>
    </section>
  );
};

export default Login;

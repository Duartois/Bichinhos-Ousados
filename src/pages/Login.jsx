import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://api-server-orcin.vercel.app/api/login", {
        email,
        password,
      });

      if (res.data && res.data.email) {
        // Atualiza o contexto e sessionStorage
        login(res.data);

        // Redirecionamento: volta pro checkout se veio de lá
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          navigate(res.data.admin ? "/admin" : "/account", { replace: true });
        }
      } else {
        setError(res.data.alert || "Erro desconhecido.");
      }
    } catch (err) {
      setError(err.response?.data?.alert || "Falha ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section min-h-screen px-4 flex items-center justify-center bg-gray-300 px-4">
      <div className="bg-white max-w-7xl h-[500px] shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Imagem lateral */}
        <div className="hidden md:block">
          <img
            src="/assets/img/login-bg.jpg"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulário */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Bem-vindo(a)!
          </h1>
          <p className="text-gray-500 mb-6">Que bom que você voltou 🧸</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-cyan-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-cyan-600" /> Lembrar-me
            </label>
            <a href="#" className="text-cyan-600 hover:underline">
              Esqueci minha senha
            </a>
          </div>

          <p className="mt-6 text-gray-600 text-center text-sm">
            Ainda não possui conta?{" "}
            <Link to="/register" className="text-cyan-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;

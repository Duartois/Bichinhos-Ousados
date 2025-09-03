import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://api-server-orcin.vercel.app/register", {
        name,
        email,
        password,
      });

      if (res.data && res.data.alert) {
        // sucesso → redireciona
        navigate("/login");
      } else {
        setError(res.data.alert || "Erro ao registrar.");
      }
    } catch (err) {
      setError(err.response?.data?.alert || "Falha ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-start md:items-center justify-center bg-gray-50 px-4">
      <div className="max-w-[1400px] w-full md:h-[700px] bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-5">
        {/* Imagem lateral */}
        <div className="hidden md:block md:col-span-3">
          <img
            src="/assets/img/signup-bg.jpg"
            alt="Cadastro"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulário */}
        <div className="p-10 flex flex-col justify-center md:col-span-2">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Primeira vez aqui?
          </h1>
          <p className="text-gray-500 mb-6">Junte-se a nós e venha criar 🧶</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              required
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              required
            />

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
                "Cadastrar"
              )}
            </button>
          </form>

          <p className="mt-6 text-gray-600 text-center text-sm">
            Já tem conta?{" "}
            <Link to="/login" className="text-cyan-600 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;

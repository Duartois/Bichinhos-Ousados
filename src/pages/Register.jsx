import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");          // NEW: number (somente dígitos)
  const [tac, setTac] = useState(false);           // NEW: termos aceitos
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações de frontend para bater com o backend
    const number = phone.replace(/\D/g, ""); // só dígitos
    if (name.trim().length < 3) {
      setLoading(false); return setError("O nome precisa de pelo menos 3 letras.");
    }
    if (!email.trim()) {
      setLoading(false); return setError("Informe um email válido.");
    }
    if (password.length < 8) {
      setLoading(false); return setError("A senha precisa de pelo menos 8 caracteres.");
    }
    if (number.length < 10) {
      setLoading(false); return setError("Informe um telefone com DDD (mín. 10 dígitos).");
    }
    if (!tac) {
      setLoading(false); return setError("Você precisa concordar com os termos de uso.");
    }
    if (password !== confirmPassword) {
      setLoading(false); return setError("As senhas não conferem.");
    }

    try {
      // Cadastro (agora com number e tac)
      const res = await axios.post("https://api-server-orcin.vercel.app/register", {
        name,
        email,
        password,
        number,
        tac,
      });

      // Sucesso no backend = HTTP 201 + objeto {name,email,seller}
      if (res.status === 201 && res.data?.email) {
        // Login automático
        const loginRes = await axios.post("https://api-server-orcin.vercel.app/login", {
          email,
          password,
        });

        if (loginRes.data && loginRes.data.email) {
          login(loginRes.data);   // ✅ atualiza contexto
          if (loginRes.data.seller) navigate("/dashboard");
          else navigate("/account");
        }

        // fallback: se não logou, manda para /login
        navigate("/login");
      } else {
        setError(res.data?.alert || "Erro ao registrar.");
      }
    } catch (err) {
      const msg = err.response?.data?.alert || "Falha ao conectar com o servidor.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section min-h-screen px-4 flex items-center justify-center bg-gray-300">
      <div className="bg-white max-w-7xl h-[650px] shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Imagem lateral */}
        <div className="hidden md:block">
          <img src="/assets/img/signup-bg.jpg" alt="Cadastro" className="h-full w-full object-cover" />
        </div>

        {/* Formulário */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Crie sua conta</h1>
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
              type="tel"
              placeholder="Telefone (com DDD)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              inputMode="numeric"
              pattern="\d{10,11}"
              title="Informe um telefone com DDD (10 ou 11 dígitos)"
              required
            />

            {/* Senha */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha (mín. 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-cyan-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmar Senha */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-cyan-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Termos */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-cyan-600"
                checked={tac}
                onChange={(e) => setTac(e.target.checked)}
                required
              />
              Concordo com os Termos de Uso
            </label>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

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

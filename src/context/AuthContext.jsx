import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const MAX_INACTIVITY = 20 * 60 * 60 * 1000; // 20h

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Hidrata user do sessionStorage na inicialização
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        if (parsed?.lastActivity && now - parsed.lastActivity > MAX_INACTIVITY) {
          sessionStorage.removeItem("user");
          setUser(null);
        } else {
          setUser(parsed || null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setReady(true); // <- SÓ AQUI liberamos os guardiões
    }
  }, []);

  // Persiste sempre que mudar
  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");
  }, [user]);

  // Bate o carimbo de atividade
  const touch = () => setUser((prev) => (prev ? { ...prev, lastActivity: Date.now() } : prev));

  // Eventos que contam como atividade
  useEffect(() => {
    const onActivity = () => touch();
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);
    return () => {
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, []);

  const login = (userData) => setUser({ ...userData, lastActivity: Date.now() });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

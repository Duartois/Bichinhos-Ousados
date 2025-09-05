import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Store, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();  // ✅ usa o contexto
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fechar menu clicando fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (user) {
      setOpen(!open); // logado → abre o menu
    } else {
      navigate("/login"); // não logado → vai para login
    }
  };

  const handleLogout = () => {
    logout(); // ✅ contexto limpa user e sessionStorage
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <User className="w-6 h-6 text-gray-700" />
      </button>

      {user && open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
          {/* Header */}
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Links dinâmicos */}
          <ul className="py-1 text-sm">
            {user.admin ? (
              <li>
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <Store size={16} /> Dashboard
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => navigate("/account")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                  >
                    <UserCircle2 size={16} /> Área do Cliente
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/admin")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Store size={16} /> Seja um vendedor
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Logout */}
          <div className="border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-500"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

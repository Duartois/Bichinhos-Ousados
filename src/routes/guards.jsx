import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RequireAuth = ({ children }) => {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null; // pode renderizar um spinner se preferir
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

export const RequireAdmin = ({ children }) => {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user.admin) return <Navigate to="/account" replace />;
  return children;
};
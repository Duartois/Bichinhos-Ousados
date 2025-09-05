import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);


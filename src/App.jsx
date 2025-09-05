import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import { UserDashboard, AdminDashboard } from "./pages/dashboard";
import Login from "./pages/Login";        // <-- ADICIONAR
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, RequireAdmin } from "./routes/guards";
import AddProduct from "./pages/dashboard/admin/AddProduct";
import AdminOrders from "./pages/dashboard/admin/AdminOrders";
import AdminSettings from "./pages/dashboard/admin/AdminSettings";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/account" element={<RequireAuth><UserDashboard /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserHome from "./pages/user/UserHome";
import UserProfile from "./pages/user/Profile";
import Cart from "./pages/user/Cart";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/UsersSection";
import AdminProducts from "./pages/admin/ProductsSection";
import AdminSales from "./pages/admin/SalesSection";
import AdminAdmin from "./pages/admin/AdminsSection";

function Main() {

    useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Usuario */}
        <Route path="/UserHome" element={<UserHome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/cart" element={<Cart />} />

        {/* Admin */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/sales" element={<AdminSales />} />
        <Route path="/admin/admin" element={<AdminAdmin />} />
      </Routes>
    </Router>
  );
}

export default Main;

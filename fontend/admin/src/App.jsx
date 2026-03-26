import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Order from "./pages/Order";
import User from "./pages/User";
import Login from "./pages/Login";

// 🔐 check login
function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <AdminLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="product" element={<Product />} />
                    <Route path="order" element={<Order />} />
                    <Route path="user" element={<User />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
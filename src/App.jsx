import { Routes, Route } from "react-router";
import Home from "./routes/home/Home";
import Catalog from "./routes/catalog/Catalog";
import ProductDetails from "./routes/productDetails/ProductDetails";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Logout from "./auth/Logout";
import Profile from "./routes/profile/Profile";
import NotFound from "./routes/notFound/NotFound";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminDashboard from "./routes/admin/AdminDashboard";
import AdminSaveProduct from "./routes/admin/saves/AdminSaveProduct";
import Orders from "./routes/orders/Orders";
import AdminSaveUser from "./routes/admin/saves/AdminSaveUser";

export default function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/products")
            .then(res => res.json())
            .then(data => setProducts(Object.values(data)))
            .catch(err => alert(err.message));
    }, []);

    return (
        <AuthProvider>
            <CartProvider>

                <Navbar />

                <Routes>
                    {/* Public pages */}
                    <Route path="/" element={<Home products={products} />} />
                    <Route path="/catalog" element={<Catalog products={products} gender="unisex" />} />
                    <Route path="/catalog/male" element={<Catalog products={products} gender="male" />} />
                    <Route path="/catalog/female" element={<Catalog products={products} gender="female" />} />
                    <Route path="/catalog/:id" element={<ProductDetails products={products} />} />

                    {/* Guest-only pages */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected pages */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/orders" element={<Orders />} />
                        <Route path="/logout" element={<Logout />} />
                    </Route>

                    {/* Admin pages */}
                    <Route path="/admin" element={<PrivateRoute isAdmin={true} />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="product/create" element={<AdminSaveProduct />} />
                        <Route path="product/edit/:id" element={<AdminSaveProduct />} /> 
                        <Route path="users/create" element={<AdminSaveUser />} />
                        <Route path="users/edit/:id" element={<AdminSaveUser />} /> 
                    </Route>

                    {/* Not found */}
                    <Route path="/*" element={<NotFound />} />
                </Routes>

                <Footer />

            </CartProvider>
        </AuthProvider>
    );
}
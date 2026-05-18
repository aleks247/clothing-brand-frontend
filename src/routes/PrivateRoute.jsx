import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ isAdmin = false }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (isAdmin && user.role !== "admin") return <Navigate to="/" replace />;

    return <Outlet />;
}

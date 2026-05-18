import { useState, useEffect } from "react";
import AdminProductsTable from "./tables/AdminProductsTable";
import AdminUsersTable from "./tables/AdminUsersTable";
import AdminOrdersTable from "./tables/AdminOrdersTable";
import { get, remove } from "../../utils/request";
import styles from "./Admin.module.css";
import { Link } from "react-router";

export default function AdminDashboard() {
    const [active, setActive] = useState("users");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                if (active === "products") {
                    const data = await get("http://localhost:3030/jsonstore/products");
                    setProducts(Object.entries(data || {}).map(([id, p]) => ({ id, ...p })));
                } else if (active === "users") {
                    const data = await get("http://localhost:3030/jsonstore/users");
                    setUsers(Object.entries(data || {}).map(([id, u]) => ({ id, ...u })));
                } else if (active === "orders") {
                    const [ordersData, usersData, productsData] = await Promise.all([
                        get("http://localhost:3030/jsonstore/orders"),
                        get("http://localhost:3030/jsonstore/users"),
                        get("http://localhost:3030/jsonstore/products")
                    ]);

                    setOrders(Object.entries(ordersData || {}).map(([id, o]) => ({ id, ...o })));
                    setUsers(Object.entries(usersData || {}).map(([id, u]) => ({ id, ...u })));
                    setProducts(Object.entries(productsData || {}).map(([id, p]) => ({ id, ...p })));
                }
            } catch (err) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [active]);

    const handleDelete = async (collection, id, setter) => {
        const confirmMsg = `Are you sure you want to delete this ${collection.slice(0, -1)}?`;
        if (!window.confirm(confirmMsg)) return;
        try {
            await remove(`http://localhost:3030/jsonstore/${collection}/${id}`);
            setter(prev => prev.filter(x => x.id !== id));
        } catch {
            alert("Failed to delete item.");
        }
    };

    return (
        <>
            <div className={styles.dashboards}>
                <button
                    className={active === "users" ? styles.activeDashboard : ""}
                    onClick={() => setActive("users")}
                >
                    Users
                </button>
                <button
                    className={active === "products" ? styles.activeDashboard : ""}
                    onClick={() => setActive("products")}
                >
                    Products
                </button>
                <button
                    className={active === "orders" ? styles.activeDashboard : ""}
                    onClick={() => setActive("orders")}
                >
                    Orders
                </button>
            </div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {active.charAt(0).toUpperCase() + active.slice(1)}
                    </h1>

                    {active === "products" && (
                        <Link to="/admin/product/create" className={styles.primaryBtn}>+ Create Product</Link>
                    )}
                    {active === "users" && (
                        <Link to="/admin/users/create" className={styles.primaryBtn}>+ Create User</Link>
                    )}
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && (
                    <>
                        {active === "users" && (
                            <AdminUsersTable
                                users={users}
                                onDelete={(id) => handleDelete("users", id, setUsers)}
                            />
                        )}

                        {active === "products" && (
                            <AdminProductsTable
                                products={products}
                                onDelete={(id) => handleDelete("products", id, setProducts)}
                            />
                        )}

                        {active === "orders" && (
                            <AdminOrdersTable
                                orders={orders}
                                users={users}
                                products={products}
                                onDelete={(id) => handleDelete("orders", id, setOrders)}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

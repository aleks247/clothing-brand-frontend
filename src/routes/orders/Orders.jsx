import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import styles from "./Orders.module.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedOrder) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedOrder]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    fetch("http://localhost:8081/orders"),
                    fetch("http://localhost:8081/products"),
                ]);

                const ordersData = await ordersRes.json();
                const productsData = await productsRes.json();

                const sortedOrders = (ordersData || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
                setProducts(productsData || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getProductDetails = (id) => products.find((p) => p.id === id) || null;

    const orderColumns = [
        {
            label: "Order ID",
            accessor: "id",
            render: (row) => <span title={row.id}>#{row.id}</span>,
        },
        {
            label: "Date",
            render: (row) =>
                new Date(row.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
        },
        {
            label: "Status",
            render: (row) => (
                <span className={`${styles.statusBadge} ${styles[row.status?.toLowerCase()]}`}>
                    {row.status}
                </span>
            ),
        },
        {
            label: "Items",
            render: (row) => (
                <span style={{ fontWeight: 600 }}>
                    {row.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} items
                </span>
            ),
        },
        {
            label: "Total Amount",
            render: (row) => <strong>${Number(row.totalAmount).toFixed(2)}</strong>,
        },
    ];

    const orderActions = (row) => (
        <button className={styles.viewBtn} onClick={() => setSelectedOrder(row)}>
            View Details
        </button>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Orders</h1>
            </div>

            {loading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
            ) : (
                <Table
                    data={orders}
                    columns={orderColumns}
                    actions={orderActions}
                    emptyMessage="No orders found."
                />
            )}

            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Order Details</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                                &times;
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.infoRow}>
                                <div>
                                    <div className={styles.modalLabel}>Order ID</div>
                                    <div>#{selectedOrder.id}</div>
                                </div>
                                <div>
                                    <div className={styles.modalLabel}>Placed On</div>
                                    <div>{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className={styles.tableWrapper}>
                                <table className={styles.itemsTable}>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th style={{ textAlign: "right" }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item, index) => {
                                            const product = getProductDetails(item.productId);
                                            const imgUrl = product?.images?.[0]?.imageUrl
                                                ? `http://localhost:8081${product.images[0].imageUrl}`
                                                : "https://via.placeholder.com/50";

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <img
                                                            src={imgUrl}
                                                            alt={item.productName}
                                                            className={styles.miniThumb}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: "bold" }}>{item.productName}</div>
                                                        <div style={{ fontSize: "12px", color: "#888" }}>
                                                            ${Number(item.price).toFixed(2)} each
                                                        </div>
                                                    </td>
                                                    <td style={{ verticalAlign: "middle" }}>x {item.quantity}</td>
                                                    <td
                                                        style={{
                                                            textAlign: "right",
                                                            verticalAlign: "middle",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total Paid</span>
                                <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
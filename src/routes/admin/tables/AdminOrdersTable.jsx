import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/Table/Table";
import { put } from "../../../utils/request";
import styles from "../Admin.module.css";

export default function AdminOrdersTable({ orders = [], users = [], products = [], onDelete }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("Pending");

    const enrichedOrders = useMemo(() => {
        return orders.map(order => {
            const user = users.find(u => u.id === order.user_id);
            const detailedProducts = (order.products || []).map(p => {
                const product = products.find(pr => Number(pr.id) === Number(p.id));
                return { ...p, name: product?.name || "Unknown product" };
            });
            return { ...order, user, detailedProducts };
        });
    }, [orders, users, products]);

    const getStatusClass = (status) => {
        const lower = status?.toLowerCase() || "";
        if (lower === "completed" || lower === "shipped") return styles.statusCompleted;
        if (lower === "processing" || lower === "pending") return styles.statusProcessing;
        if (lower === "cancelled") return styles.statusCancelled;
        return styles.statusDefault;
    };

    useEffect(() => {
        if (selectedOrder) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedOrder]);

    const openModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status || "Pending");
    };

    const closeModal = () => setSelectedOrder(null);

    const saveStatus = async () => {
        if (!selectedOrder) return;

        try {
            const { detailedProducts, user, ...orderToSave } = {
                ...selectedOrder,
                status: newStatus,
            };

            await put(
                `http://localhost:3030/jsonstore/orders/${selectedOrder.id}`,
                orderToSave
            );

            enrichedOrders.forEach((o) => {
                if (o.id === selectedOrder.id) o.status = newStatus;
            });

            setSelectedOrder(null);
        } catch {
            alert("Failed to update status");
        }
    };

    const columns = [
        { label: "Order ID", render: o => <span className={styles.mono}>#{o.id.slice(0, 8)}</span> },
        { label: "Customer", render: o => o.user ? `${o.user.firstName} ${o.user.lastName}` : o.user_id },
        { label: "Total", render: o => `$${o.total.toFixed(2)}` },
        {
            label: "Status",
            render: o => (
                <span className={`${styles.statusBadge} ${getStatusClass(o.status)}`}>
                    {o.status}
                </span>
            )
        }
    ];

    const actions = (order) => (
        <div className={styles.actionGroupRight}>
            <button
                className={`${styles.actionBtn} ${styles.viewBtn}`}
                onClick={() => openModal(order)}
            >
                Change Status
            </button>
            <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(order.id)}
            >
                Delete
            </button>
        </div>
    );

    return (
        <>
            <Table
                data={enrichedOrders}
                columns={columns}
                actions={actions}
                emptyMessage="No orders found."
            />

            {selectedOrder && (
                <div className={styles.modalOverlay} style={{ zIndex: 1000 }}>
                    <div className={styles.modalContentSmall}>
                        <h3>Update Order Status</h3>
                        <p className={styles.mono}>Order #{selectedOrder.id}</p>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Select Status</label>
                            <select
                                className={styles.select}
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {["Pending", "Processing", "Shipped", "Completed", "Cancelled"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={saveStatus}>Save Status</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

import { useEffect, useState } from "react";
import { get } from "../../utils/request";
import Table from "../../components/Table/Table";
import styles from "./Orders.module.css"; 

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]); 
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, productsData] = await Promise.all([
                    get("http://localhost:3030/jsonstore/orders"),
                    get("http://localhost:3030/jsonstore/products")
                ]);

                const orderItems = Object.values(ordersData || {}).sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setOrders(orderItems);

                const productItems = Object.entries(productsData || {}).map(([id, p]) => ({ id, ...p }));
                setProducts(productItems);

            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getProductDetails = (id) => {
        return products.find(p => p.id == id) || null;
    };

    const orderColumns = [
        { 
            label: "Order ID", 
            accessor: "_id",
            render: (row) => <span title={row._id}>#{row._id.slice(0, 8)}...</span>
        },
        { 
            label: "Date", 
            render: (row) => new Date(row.date).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        },
        { 
            label: "Items", 
            render: (row) => {
                const count = row.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;
                return <span style={{fontWeight: 600}}>{count} items</span>;
            }
        },
        { 
            label: "Total Amount", 
            render: (row) => <strong>${Number(row.total).toFixed(2)}</strong>
        }
    ];

    const orderActions = (row) => (
        <button 
            className={styles.viewBtn} 
            onClick={() => setSelectedOrder(row)}
        >
            View Details
        </button>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Orders</h1>
            </div>

            {loading ? (
                <div style={{padding: '20px', textAlign: 'center'}}>Loading...</div>
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
                            <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>&times;</button>
                        </div>
                        
                        <div className={styles.modalBody}>
                            <div className={styles.infoRow}>
                                <div>
                                    <div className={styles.modalLabel}>Order ID</div>
                                    <div>{selectedOrder._id}</div>
                                </div>
                                <div>
                                    <div className={styles.modalLabel}>Placed On</div>
                                    <div>{new Date(selectedOrder.date).toLocaleString()}</div>
                                </div>
                            </div>

                            <div>
                                <div className={styles.modalLabel} style={{marginBottom:'10px'}}>Items Ordered</div>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.itemsTable}>
                                        <thead>
                                            <tr>
                                                <th style={{width: '60px'}}>Image</th>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th style={{textAlign:'right'}}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.products.map((item, index) => {
                                                const product = getProductDetails(item.id);
                                                
                                                if (!product) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>-</td>
                                                            <td style={{color:'red'}}>Product Unavailable (ID: {item.id})</td>
                                                            <td>x{item.quantity}</td>
                                                            <td style={{textAlign:'right'}}>-</td>
                                                        </tr>
                                                    );
                                                }

                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <img 
                                                                src={product.images?.[0] || product.image || "https://via.placeholder.com/50"} 
                                                                alt={product.name} 
                                                                className={styles.miniThumb} 
                                                            />
                                                        </td>
                                                        <td>
                                                            <div style={{fontWeight:'bold'}}>{product.name}</div>
                                                            <div style={{fontSize:'12px', color:'#888'}}>${Number(product.price).toFixed(2)} each</div>
                                                        </td>
                                                        <td style={{verticalAlign:'middle'}}>
                                                            x {item.quantity}
                                                        </td>
                                                        <td style={{textAlign:'right', verticalAlign:'middle', fontWeight:'600'}}>
                                                            ${(Number(product.price) * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total Paid</span>
                                <span>${selectedOrder.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { Link } from "react-router";
import Table from "../../../components/Table/Table";
import styles from "../Admin.module.css";

export default function AdminProductsTable({ products, onDelete }) {
    const columns = [
        {
            label: "Product",
            render: (p) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                        src={p.images?.[0] || p.image || ""}
                        alt={p.name}
                        className={styles.tableThumb}
                    />
                    <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div className={styles.mono} style={{ fontSize: "11px" }}>
                            ID: {p.id}
                        </div>
                    </div>
                </div>
            ),
        },
        { label: "Price", render: (p) => `$${Number(p.price).toFixed(2)}` },
        { label: "Category", render: (p) => <span className={styles.categoryBadge}>{p.category}</span> },
    ];

    const actions = (p) => (
        <div className={styles.actionGroupRight}>
            <Link to={`/catalog/${p.id}`}>
                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>View</button>
            </Link>
            <Link to={`/admin/product/edit/${p.id}`}>
                <button className={`${styles.actionBtn} ${styles.editBtn}`}>Edit</button>
            </Link>
            <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(p.id)}
            >
                Delete
            </button>
        </div>
    );

    return <Table data={products} columns={columns} actions={actions} emptyMessage="No products found." />;
}

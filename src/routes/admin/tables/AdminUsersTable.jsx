import Table from "../../../components/Table/Table";
import { Link } from "react-router";
import styles from "../Admin.module.css";

export default function AdminUsersTable({ users, onDelete }) {
    const columns = [
        {
            label: "User",
            render: (u) => (
                <div>
                    <div style={{ fontWeight: 600 }}>
                        {u.firstName} {u.lastName}
                    </div>
                    <div className={styles.mono}>{u.email}</div>
                </div>
            )
        },
        {
            label: "Role",
            render: (u) => (
                <span className={styles.roleBadge}>
                    {u.role || "user"}
                </span>
            )
        },
        {
            label: "Created",
            render: (u) =>
                u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"
        }
    ];

    const actions = (user) => (
        <div className={styles.actionGroupRight}>
            <Link to={`/admin/users/edit/${user.id}`}>
                <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                    Update
                </button>
            </Link>

            <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(user.id)}
            >
                Delete
            </button>
        </div>
    );

    return (
        <Table
            data={users}
            columns={columns}
            actions={actions}
            emptyMessage="No users found."
        />
    );
}

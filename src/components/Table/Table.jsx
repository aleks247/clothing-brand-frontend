import styles from "./Table.module.css";

export default function Table({ data, columns, actions, emptyMessage = "No data found." }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={col.className || ""}>
                                {col.label}
                            </th>
                        ))}
                        {actions && <th style={{ textAlign: "right" }}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className={styles.emptyState}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={`${rowIndex}-${colIndex}`} className={col.className || ""}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { get, post, put } from "../../../utils/request"; // Ensure you have put and post imported
import styles from "./../Admin.module.css";

const initialFormState = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user", 
};

export default function AdminSaveUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(isEditMode); 
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchUser = async () => {
            try {
                const data = await get(`http://localhost:3030/jsonstore/users/${id}`);

                setFormData({
                    email: data.email || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    role: data.role || "user",
                    password: "", 
                });
            } catch (err) {
                setError("Failed to fetch user data. User might not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!formData.email || !formData.firstName || !formData.lastName) {
            setError("Please fill in all required fields (Email, First Name, Last Name).");
            return;
        }

        if (!isEditMode && !formData.password) {
             setError("Password is required when creating a new user.");
             return;
        }

        setSubmitting(true);

        try {
            const url = isEditMode
                ? `http://localhost:3030/jsonstore/users/${id}`
                : "http://localhost:3030/jsonstore/users";

            const method = isEditMode ? put : post;

            const dataToSend = { ...formData };
            
           if (isEditMode && !dataToSend.password) {
                delete dataToSend.password;
            }

            if (!isEditMode) {
                 dataToSend.createdAt = new Date().toISOString();
            }

            await method(url, dataToSend);

            navigate("/admin"); 

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to save user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container} style={{ alignItems: "center", justifyContent: "center" }}>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container} style={{ maxWidth: "800px" }}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{isEditMode ? "Edit User" : "Create New User"}</h1>
                    <Link to="/admin">
                        <button className={styles.cancelBtn}>Cancel</button>
                    </Link>
                </div>

                {error && (
                    <div style={{ backgroundColor: "#FEE2E2", color: "#DC2626", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    
                    {/* Email & Role Row */}
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="role" className={styles.label}>Role</label>
                            <select
                                id="role"
                                name="role"
                                className={styles.select}
                                value={formData.role}
                                onChange={handleChange}
                                disabled={submitting}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password {isEditMode ? "(Leave blank to keep current)" : "*"}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            // Required only on create mode
                            required={!isEditMode}
                            disabled={submitting}
                            placeholder={isEditMode ? "••••••" : ""}
                        />
                    </div>

                     {/* First Name & Last Name Row */}
                     <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="firstName" className={styles.label}>First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className={styles.input}
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={styles.input}
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                            {submitting ? "Saving..." : (isEditMode ? "Update User" : "Create User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
    const { user, userUpdate } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "Loading..",
        lastName: "Loading..",
        email: "Loading..",
        address: "Loading..",
        role: "Loading..",
    });

    // Fetch the user from the JSON store by ID
    useEffect(() => {
        const fetchUser = async () => {
            if (!user?._id) return;

            try {
                const response = await fetch(
                    `http://localhost:3030/jsonstore/users/${user._id}`
                );

                if (!response.ok) throw new Error("Failed to fetch user");

                const data = await response.json();
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    address: data.address || "",
                    role: data.role || "",
                });
            } catch (error) {
                console.error(error);
                alert("Could not load profile.");
            }
        };

        fetchUser();
    }, [user?._id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:3030/jsonstore/users/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error("Failed to update user");

            const updatedUser = await response.json();
            userUpdate(updatedUser); // Update context with new data
            setIsEditing(false);
            alert("Profile updated!");
        } catch (error) {
            console.error(error);
            alert("Could not update profile.");
        }
    };

    const handleCancel = () => setIsEditing(false);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.avatarWrapper}>
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
                        alt="Profile"
                        className={styles.avatar}
                    />
                </div>
                <h2 className={styles.userName}>
                    {formData.firstName} {formData.lastName}
                </h2>
                <span className={styles.userRole}>{formData.role}</span>
            </aside>

            <div className={styles.details}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Profile Settings</h1>
                    {!isEditing && (
                        <button
                            className={styles.editBtn}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form className={styles.grid} onSubmit={handleSave}>
                    <div className={styles.group}>
                        <label className={styles.label}>First Name</label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Last Name</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={styles.input}
                        />
                    </div>

                    {isEditing && (
                        <div className={styles.actions}>
                            <button type="submit" className={styles.saveBtn}>
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

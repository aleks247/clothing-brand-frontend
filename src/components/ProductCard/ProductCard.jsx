import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./ProductCard.module.css";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ProductCard({ product }) {
    const [imageError, setImageError] = useState(false);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link
            to={`/catalog/${product.id}`}
            className={styles["card"]}
            style={{ textDecoration: "none" }}
        >
            <div className={styles["imgWrapper"]}>
                {product.tag && (
                    <div className={styles["tag"]}>{product.tag}</div>
                )}

                {product.images.length > 0 && !imageError ? (
                    <img
                        src={"http://localhost:8081"+product.images[0].imageUrl}
                        alt={product.name}
                        className={styles["productImg"]}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ opacity: 0.1 }}
                    >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0 2-.9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                )}
            </div>

            <div className={styles["info"]}>
                <h3>{product.name}</h3>
                <div className={styles["desc"]}>{product.desc}</div>

                <div className={styles["footer"]}>
                    <div className={styles["price"]}>
                        ${product.price.toFixed(2)}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (isAuthenticated) {
                                addToCart(product);
                            } else {
                                navigate("/login");
                            }
                        }}
                        className={styles["addBtn"]}
                    >Add to cart</button>
                </div>
            </div>
        </Link>
    );
}

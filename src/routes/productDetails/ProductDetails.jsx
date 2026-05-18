import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCart } from "../../contexts/CartContext";
import styles from "./ProductDetails.module.css";
import { useAuth } from "../../contexts/AuthContext";

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        fetch(`http://localhost:3030/jsonstore/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setMainImage(data.images?.[0] || data.image || "");
            })
            .catch((err) => alert(err.message));
    }, [id]);

    if (!product) {
        return (
            <div style={{ textAlign: "center", padding: "100px" }}>
                <h2>Product not found</h2>
                <Link to="/catalog" style={{ textDecoration: "underline" }}>
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const images =
        product.images && product.images.length > 0
            ? product.images
            : [product.image];

    return (
        <div className={styles.container}>
            <div className={styles.gallery}>
                <div className={styles.mainImageWrapper}>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={styles.mainImage}
                    />
                </div>

                <div className={styles.thumbnails}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`View ${index}`}
                            className={`${styles.thumb} ${
                                mainImage === img ? styles.activeThumb : ""
                            }`}
                            onClick={() => setMainImage(img)}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.breadcrumb}>
                    <Link
                        to="/catalog"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Catalog
                    </Link>{" "}
                    / {product.category || "Clothing"}
                </div>

                <h1 className={styles.title}>{product.name}</h1>
                <div className={styles.price}>${product.price.toFixed(2)}</div>

                <p className={styles.description}>{product.desc}</p>

                <div className={styles.selectorGroup}>
                    <span className={styles.label}>Color</span>
                    <div className={styles.colorOptions}>
                        {product.colors &&
                            product.colors.map((c, i) => (
                                <div
                                    key={i}
                                    className={styles.colorCircle}
                                    style={{ backgroundColor: c }}
                                ></div>
                            ))}
                    </div>
                </div>

                <div className={styles.selectorGroup}>
                    <span className={styles.label}>Size</span>
                    <div className={styles.sizeOptions}>
                        <div className={styles.sizeBox}>S</div>
                        <div className={styles.sizeBox}>M</div>
                        <div className={styles.sizeBox}>L</div>
                        <div className={styles.sizeBox}>XL</div>
                    </div>
                </div>

                <button
                    className={styles.addToCartBtn}
                    onClick={() => {
                        isAuthenticated? addToCart(product) : navigate("/login")
                    }}
                >Add to Cart</button>
            </div>
        </div>
    );
}

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
    const [mainImage, setMainImage] = useState(null);

    const BACKEND_URL = "http://localhost:8081";

    useEffect(() => {
        fetch(`${BACKEND_URL}/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                // Safely set the initial image object if it exists
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                } else if (data.image) {
                    setMainImage({ imageUrl: data.image });
                } else {
                    setMainImage(null);
                }
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

    // Normalized array to ensure we are always mapping over objects with an 'imageUrl' property
    const images = product.images && product.images.length > 0
        ? product.images
        : [{ imageUrl: product.image || "" }];

    return (
        <div className={styles.container}>
            <div className={styles.gallery}>
                <div className={styles.mainImageWrapper}>
                    {mainImage && mainImage.imageUrl ? (
                        <img
                            src={`${BACKEND_URL}${mainImage.imageUrl}`}
                            alt={product.name}
                            className={styles.mainImage}
                        />
                    ) : (
                        <div className={styles.placeholder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', background: '#eee' }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.2 }}>
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0 2-.9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className={styles.thumbnails}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={`${BACKEND_URL}${img.imageUrl}`}
                            alt={`View ${index}`}
                            className={`${styles.thumb} ${
                                mainImage?.imageUrl === img.imageUrl ? styles.activeThumb : ""
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
                <div className={styles.price}>${product.price ? product.price.toFixed(2) : "0.00"}</div>

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
                        isAuthenticated ? addToCart(product) : navigate("/login");
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
import { Link } from "react-router";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Home.module.css";

export default function Home({ products }) {
    const trendingProducts = products.slice(0, 3);

    return (
        <div className={styles["container"]}>
            <section className={styles["hero"]}>
                <div className={styles["heroContent"]}>
                    <span className={styles["heroLabel"]}>
                        Summer Collection 2025
                    </span>
                    <h1 className={styles["heroTitle"]}>
                        Definitive Wardrobe Staples.
                    </h1>
                    <p className={styles["heroDesc"]}>
                        Elevated essentials designed for the modern individual.
                        Sustainable fabrics, timeless cuts, and effortless
                        style.
                    </p>

                    <Link to="/catalog" className={styles["ctaButton"]}>
                        Shop Collection
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className={styles["heroImage"]}>
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
                        alt="Hero Model"
                        className={styles["heroImgReal"]}
                    />
                </div>
            </section>

            <section className={styles["section"]}>
                <div className={styles["sectionHeader"]}>
                    <h2 className={styles["sectionTitle"]}>Shop by Category</h2>
                    <Link to="/catalog" className={styles["linkArrow"]}>
                        View All
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </Link>
                </div>

                <div className={styles["bentoGrid"]}>
                    <Link
                        to="/catalog"
                        className={`${styles["bentoItem"]} ${styles["textWhite"]}`}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                            alt="New Arrivals"
                            className={styles["bentoBg"]}
                        />
                        <div className={styles["bentoContent"]}>
                            <h3 className={styles["bentoTitle"]}>
                                New Arrivals
                            </h3>
                            <p className={styles["bentoSub"]}>
                                Fresh fits for the season
                            </p>
                        </div>
                    </Link>

                    <Link to="/catalog" className={styles["bentoItem"]}>
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                            alt="Women"
                            className={styles["bentoBg"]}
                            style={{ opacity: 0.1 }}
                        />
                        <div className={styles["bentoContent"]}>
                            <h3 className={styles["bentoTitle"]}>Women</h3>
                            <p className={styles["bentoSub"]}>120 Products</p>
                        </div>
                    </Link>

                    <Link to="/catalog" className={styles["bentoItem"]}>
                        <img
                            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
                            alt="Men"
                            className={styles["bentoBg"]}
                            style={{ opacity: 0.1 }}
                        />
                        <div className={styles["bentoContent"]}>
                            <h3 className={styles["bentoTitle"]}>Men</h3>
                            <p className={styles["bentoSub"]}>85 Products</p>
                        </div>
                    </Link>
                </div>
            </section>

            <section className={styles["section"]} style={{ paddingTop: 0 }}>
                <div className={styles["sectionHeader"]}>
                    <h2 className={styles["sectionTitle"]}>Trending Now</h2>
                </div>
                <div className={styles["trendingGrid"]}>
                    {trendingProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            <div className={styles["newsletter"]}>
                <h2>Join the Club</h2>
                <p>
                    Subscribe to receive updates, access to exclusive deals, and
                    more. No spam, we promise.
                </p>
                <div className={styles["inputGroup"]}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className={styles["emailInput"]}
                    />
                    <button className={styles["subBtn"]}>Subscribe</button>
                </div>
            </div>
        </div>
    );
}

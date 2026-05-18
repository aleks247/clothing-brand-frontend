import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles["container"]}>
            <div className={styles["text"]}>
                © 2025 MODA Store. All rights reserved.
            </div>
            <div className={styles["links"]}>
                <a href="#" className={styles["link"]}>
                    Privacy
                </a>
                <a href="#" className={styles["link"]}>
                    Terms
                </a>
                <a href="#" className={styles["link"]}>
                    Contact
                </a>
            </div>
        </footer>
    );
}

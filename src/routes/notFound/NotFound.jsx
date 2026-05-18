import { Link } from "react-router";
import styles from "./NotFound.module.css";

export default function NotFound() {
    return (
        <div className={styles["container"]}>
            <div className={styles["errorCode"]}>404</div>
            <h1 className={styles["title"]}>Page Not Found</h1>
            <p className={styles["desc"]}>
                The page you are looking for doesn't exist or has been moved.
            </p>

            <Link to="/" className={styles["homeBtn"]}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Home
            </Link>
        </div>
    );
}

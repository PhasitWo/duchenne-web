import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import styles from "../styles/common.module.css"

export default function GoBack() {
    const navigate = useNavigate();
    return (
        <div style={{ marginBottom: "10px", display: "inline-block" }}>
            <a className={styles.navLink} onClick={() => navigate(-1)} style={{ color: "grey", display: "flex", alignItems: "center" }}>
                <FaArrowLeftLong />
                <span style={{ marginLeft: "5px" }}>Go back</span>
            </a>
        </div>
    );
}

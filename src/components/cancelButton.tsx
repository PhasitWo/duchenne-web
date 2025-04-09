import { ButtonHTMLAttributes } from "react";
import styles from "../styles/common.module.css";
import { ImCancelCircle } from "react-icons/im";

export default function CancelButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={styles.outlinedButton} {...props}>
            <ImCancelCircle />
            <span>Cancel</span>
        </button>
    );
}

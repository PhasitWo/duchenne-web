import { ButtonHTMLAttributes } from "react";
import styles from "../styles/common.module.css";

export default function AddButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={styles.button} {...props}>
            + Add
        </button>
    );
}

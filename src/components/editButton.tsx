import { ButtonHTMLAttributes } from "react";
import styles from "../styles/common.module.css";
import { GoPencil } from "react-icons/go";

export default function EditButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={styles.button}
            {...props}
        >
            <GoPencil />
            <span>Edit</span>
        </button>
    );
}

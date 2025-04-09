import { ButtonHTMLAttributes } from "react";
import styles from "../styles/common.module.css";
import { Translate } from "../hooks/LanguageContext";

export default function AddButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={styles.button} {...props}>
            <Translate token="+ Add" />
        </button>
    );
}

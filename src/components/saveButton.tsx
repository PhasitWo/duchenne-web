import { ButtonHTMLAttributes } from "react";
import styles from "../styles/common.module.css";
import { IoSaveOutline } from "react-icons/io5";

export default function SaveButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={styles.button} {...props}>
            <IoSaveOutline />
            <span>Save</span>
        </button>
    );
}

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "../styles/common.module.css";
import { ImCancelCircle } from "react-icons/im";

export default function OutlineButton(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
    const { children, ...rest } = props;
    return (
        <button className={styles.outlinedButton} {...rest}>
            <ImCancelCircle />
            <span>{children}</span>
        </button>
    );
}

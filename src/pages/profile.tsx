import Header from "../components/header";
import styles from "../styles/common.module.css";
import { useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../components/goback";

interface Info {
    id: number | string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    username: string;
    password: string;
}

interface PasswordCondition {
    length: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    numeric: boolean;
}

const engRegex = /^[A-Za-z0-9]*$/;

export default function Profile() {
    const [info, setInfo] = useState<Info>(initialInfo);
    const infoRef = useRef<Info>(); // save prevState on editing
    const [onEdit, setOnEdit] = useState(false);
    const [pwdConditions, setPwdConditions] = useState<PasswordCondition>(initialPwdCondition);

    const checkConditions = (password: string) => {
        if (password.length === 0) {
            setPwdConditions(initialPwdCondition)
            setInfo({ ...info, password: password });
            return
        }
        if (!engRegex.test(password)) return; // english only
        let newCondition: PasswordCondition = {...initialPwdCondition};
        newCondition.length = password.length >= 8 && password.length <= 20;
        for (let i = 0; i < password.length; i++) {
            const char = password.charAt(i);
            if (!isNaN((char as any) * 1)) newCondition.numeric = true;
            else if (char === char.toLowerCase()) newCondition.lowerCase = true;
            else if (char === char.toUpperCase()) newCondition.upperCase = true;
        }
        setPwdConditions(newCondition);
        setInfo({ ...info, password: password });
    };

    return (
        <>
            <Header>My Profile</Header>
            <div id="content-body">
                <GoBack />
                <div id="info-container" className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Doctor Infomation</h3>
                        {!onEdit && (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    setOnEdit(true);
                                    infoRef.current = info;
                                }}
                            >
                                <GoPencil />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>ID</label>
                        <input type="text" className={styles.infoInput} value={info.id} disabled />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>First Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.firstName}
                            onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Middle Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.middleName}
                            onChange={(e) => setInfo({ ...info, middleName: e.target.value })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Last Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.lastName}
                            onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Role</label>
                        <input type="text" className={styles.infoInput} value={info.role} disabled />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Username</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.username}
                            onChange={(e) => setInfo({ ...info, username: e.target.value })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Password</label>
                        <input
                            type={onEdit ? "text" : "password"}
                            className={styles.infoInput}
                            value={info.password}
                            onChange={(e) => checkConditions(e.target.value)}
                            disabled={!onEdit}
                        />
                    </div>

                    {onEdit && (
                        <>
                            <div className={styles.infoInputContainer}>
                                <div style={{color:"grey"}}>(password conditions)</div>
                                <div>
                                    <span style={{ color: pwdConditions.length ? "green" : "red" }}>
                                        {"Passwords must be between 8-20 characters in length"}
                                    </span>
                                    <br />
                                    <span style={{ color: pwdConditions.lowerCase ? "green" : "red" }}>
                                        {"a minimum of 1 lower case letter [a-z]"}
                                    </span>
                                    <br />
                                    <span style={{ color: pwdConditions.upperCase ? "green" : "red" }}>
                                        {"a minimum of 1 upper case letter [A-Z]"}
                                    </span>
                                    <br />
                                    <span style={{ color: pwdConditions.numeric ? "green" : "red" }}>
                                        {"a minimum of 1 numeric character [0-9]"}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.infoFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setOnEdit(false);
                                        setInfo(infoRef.current as Info);
                                    }}
                                >
                                    <ImCancelCircle />
                                    <span>Cancel</span>
                                </button>
                                <button className={styles.button} onClick={() => setOnEdit(true)}>
                                    <IoSaveOutline />
                                    <span>Save</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

const initialInfo: Info = {
    id: "-",
    firstName: "-",
    middleName: "-",
    lastName: "-",
    role: "-",
    username: "-",
    password: "",
};

const initialPwdCondition: PasswordCondition = {
    length: false,
    lowerCase: false,
    upperCase: false,
    numeric: false,
};

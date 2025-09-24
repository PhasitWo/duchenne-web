import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import GoBack from "../../components/goback";
import { Checkbox, Chip, MenuItem, Select } from "@mui/material";
import { Doctor } from "../../model/model";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../loading";
import { useDoctorStore } from "../../stores/doctor";

interface PasswordCondition {
    length: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    numeric: boolean;
}

const engRegex = /^[A-Za-z0-9]*$/;

export default function AddDoctor() {
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<Doctor & { password: string }>(initialInfo);
    const [pwdConditions, setPwdConditions] = useState<PasswordCondition>(initialPwdCondition);
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const { createDoctor } = useDoctorStore();

    const checkConditions = (password: string) => {
        if (password.length === 0) {
            setPwdConditions(initialPwdCondition);
            setInfo({ ...info, password: password });
            return;
        }
        if (!engRegex.test(password)) return; // english only
        let newCondition: PasswordCondition = { ...initialPwdCondition };
        newCondition.length = password.length >= 8 && password.length <= 20;
        for (let i = 0; i < password.length; i++) {
            let char = password.charAt(i);
            if (!isNaN((char as any) * 1)) newCondition.numeric = true;
            else if (char === char.toLowerCase()) newCondition.lowerCase = true;
            else if (char === char.toUpperCase()) newCondition.upperCase = true;
        }
        setPwdConditions(newCondition);
        setInfo({ ...info, password: password });
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        if (
            info.firstName.trim() === "" ||
            info.lastName.trim() === "" ||
            info.role.trim() === "" ||
            info.username.trim() === "" ||
            info.password.trim() === ""
        ) {
            toast.error("Not enough information");
            return;
        }

        if (!evaluate(pwdConditions)) {
            toast.error("Bad password");
            return;
        }
        if (confirmPassword !== info.password) {
            toast.error("Mismatched password confirmation");
            return;
        }
        const requestBody = {
            ...info,
            middleName: info.middleName === "" ? null : info.middleName,
            specialist: info.specialist === "" ? null : info.specialist,
        };
        setIsLoading(true);
        const newId = await createDoctor(requestBody);
        setIsLoading(false);
        if (newId) navigate("/doctor/" + newId);
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <Header>Add New Doctor Account</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Doctor Infomation</h3>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>First Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.firstName}
                            onChange={(e) => setInfo({ ...info, firstName: e.target.value.trim() })}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Middle Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.middleName ?? ""}
                            onChange={(e) => setInfo({ ...info, middleName: e.target.value.trim() })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Last Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.lastName}
                            onChange={(e) => setInfo({ ...info, lastName: e.target.value.trim() })}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Specialist</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.specialist ?? ""}
                            onChange={(e) => setInfo({ ...info, specialist: e.target.value.trim() })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Role*</label>
                        <Select
                            value={info.role}
                            onChange={(e) => setInfo({ ...info, role: e.target.value })}
                            size="small"
                            sx={{ paddingLeft: 0 }}
                            required
                        >
                            <MenuItem value="root">
                                <Chip label="root" color="secondary" variant="outlined" />
                            </MenuItem>
                            <MenuItem value="admin">
                                <Chip label="admin" color="info" variant="outlined" />
                            </MenuItem>
                            <MenuItem value="user">
                                <Chip label="user" color="success" variant="outlined" />
                            </MenuItem>
                        </Select>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Can be appointed</label>
                        <Checkbox
                            sx={{ width: "fit-content", padding: 0 }}
                            checked={info.canBeAppointed}
                            onChange={(_, v) => setInfo({ ...info, canBeAppointed: v })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Username*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.username}
                            onChange={(e) => setInfo({ ...info, username: e.target.value.trim() })}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Password*</label>
                        <input
                            type="password"
                            className={styles.infoInput}
                            value={info.password}
                            onChange={(e) => checkConditions(e.target.value.trim())}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <div style={{ color: "grey" }}>(Password Conditions)</div>
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
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Confirm Password*</label>
                        <input
                            type="password"
                            className={styles.infoInput}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.infoFooter}>
                        <button className={styles.button} onClick={handleSave}>
                            <IoSaveOutline />
                            <span>Save</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

const initialInfo: Doctor & { password: string } = {
    id: -1,
    firstName: "",
    middleName: "",
    lastName: "",
    role: "",
    username: "",
    password: "",
    specialist: null,
    canBeAppointed: true,
};

const initialPwdCondition: PasswordCondition = {
    length: false,
    lowerCase: false,
    upperCase: false,
    numeric: false,
};

const evaluate = (obj: any) => {
    for (let key in obj) {
        if (obj[key] === false) return false;
    }
    return true;
};

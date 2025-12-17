import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import styles from "../styles/common.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../components/goback";
import { Doctor } from "../model/model";
import Loading from "./loading";
import { toast } from "react-toastify";
import { Checkbox, Chip } from "@mui/material";
import { useDoctorStore } from "../stores/doctor";

interface PasswordCondition {
    length: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    numeric: boolean;
}

const engRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

export default function Profile() {
    // hook
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(true);
    const infoRef = useRef<Doctor>(); // save prevState on editing
    const [info, setInfo] = useState<Doctor>(initialInfo);
    const [onChangePassword, setOnChangePassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdConditions, setPwdConditions] = useState<PasswordCondition>(initialPwdCondition);
    const [onEdit, setOnEdit] = useState(false);
    const getProfile = useDoctorStore((state) => state.getProfile);
    const updateProfile = useDoctorStore((state) => state.updateProfile);

    const checkConditions = (password: string) => {
        if (password.length === 0) {
            setPwdConditions(initialPwdCondition);
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
    };

    const handleSave = async () => {
        if (
            info.firstName.trim() === "" ||
            info.lastName.trim() === "" ||
            info.role.trim() === "" ||
            info.username.trim() === ""
        ) {
            toast.error("Not enough information");
            return;
        }
        const requestBody: Doctor & { password?: string } = {
            ...info,
            middleName: info.middleName === "" ? null : info.middleName,
            specialist: info.specialist === "" ? null : info.specialist,
        };
        if (onChangePassword) {
            if (password.trim() === "") {
                toast.error("Password cannot be empty");
                return;
            }
            if (!evaluate(pwdConditions)) {
                toast.error("Bad password");
                return;
            }
            if (confirmPassword !== password) {
                toast.error("Mismatched password confirmation");
                return;
            }
            requestBody.password = password;
        }
        setIsLoading(true);
        const succeed = await updateProfile(requestBody);
        setIsLoading(false);
        if (succeed) navigate("/reload");
    };

    const fetch = useCallback(async () => {
        setIsLoading(true);
        const profile = await getProfile();
        setIsLoading(false);
        if (profile) {
            infoRef.current = profile;
            setInfo(profile);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        checkConditions(password);
    }, [password]);

    useEffect(() => {
        // reset
        setPassword("");
        setConfirmPassword("");
        setOnChangePassword(false);
    }, [onEdit]);

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>Your Profile</Header>
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
                        <label className={styles.infoLabel}>First Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.firstName}
                            onChange={(e) => setInfo({ ...info, firstName: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Middle Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.middleName ?? ""}
                            onChange={(e) => setInfo({ ...info, middleName: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Last Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.lastName}
                            onChange={(e) => setInfo({ ...info, lastName: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Specialist</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.specialist ?? ""}
                            onChange={(e) => setInfo({ ...info, specialist: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Role*</label>
                        <div>
                            <Chip label={info.role} color={roleColorMap[info.role]} variant="outlined" />
                        </div>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Can be appointed</label>
                        <Checkbox
                            sx={{ width: "fit-content", padding: 0 }}
                            checked={info.canBeAppointed}
                            onChange={(_, v) => setInfo({ ...info, canBeAppointed: v })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Username*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.username}
                            onChange={(e) => setInfo({ ...info, username: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    {onEdit && (
                        <div className={styles.infoInputContainer}>
                            <label className={styles.infoLabel}>Change Password</label>
                            <Checkbox
                                sx={{ width: "fit-content", padding: 0 }}
                                checked={onChangePassword}
                                onChange={(_, v) => setOnChangePassword(v)}
                                disabled={!onEdit}
                            />
                        </div>
                    )}
                    {onEdit && onChangePassword && (
                        <>
                            <div className={styles.infoInputContainer}>
                                <label className={styles.infoLabel}>Password*</label>
                                <input
                                    type={onEdit ? "text" : "password"}
                                    className={styles.infoInput}
                                    value={password}
                                    onChange={(e) => {
                                        if (!engRegex.test(e.target.value)) return; // english only
                                        setPassword(e.target.value.trim());
                                    }}
                                    disabled={!onEdit}
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
                                />
                            </div>
                        </>
                    )}

                    {onEdit && (
                        <div className={styles.infoFooter}>
                            <div></div>
                            <div className={styles.infoCancelSaveContainer}>
                                <button
                                    className={styles.outlinedButton}
                                    onClick={() => {
                                        setOnEdit(false);
                                        setInfo(infoRef.current as Doctor);
                                    }}
                                >
                                    <ImCancelCircle />
                                    <span>Cancel</span>
                                </button>
                                <button className={styles.button} onClick={handleSave}>
                                    <IoSaveOutline />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const initialInfo: Doctor = {
    id: -1,
    firstName: "-",
    middleName: "-",
    lastName: "-",
    role: "user",
    username: "-",
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

const roleColorMap: {
    [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
} = {
    root: "secondary",
    admin: "info",
    user: "success",
};

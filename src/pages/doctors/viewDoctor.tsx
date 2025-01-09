import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../../components/goback";
import AppointmentDataGrid, { AppointmentType } from "../../components/appointmentDataGrid";
import { useAuthApiContext } from "../../hooks/authApiContext";
import { Doctor, ErrResponse } from "../../model/model";
import Loading from "../loading";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface PasswordCondition {
    length: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    numeric: boolean;
}

const engRegex = /^[A-Za-z0-9]*$/;

export default function ViewDoctor() {
    // hook
    const { id } = useParams();
    const { api } = useAuthApiContext();
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(true);
    const infoRef = useRef<Doctor>(); // save prevState on editing
    const [info, setInfo] = useState<Doctor>(initialInfo);
    const [pwdConditions, setPwdConditions] = useState<PasswordCondition>(initialPwdCondition);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    useEffect(() => {
        fetch();
    }, []);
    const fetch = useCallback(async () => {
        try {
            let res = await api.get<Doctor>("/api/doctor/" + id);
            switch (res.status) {
                case 200:
                    infoRef.current = res.data;
                    setInfo(res.data);
                      console.log(res.data);
                    setConfirmPassword(res.data.password);
                    break;
                case 404:
                    navigate("/notFound");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkConditions(info.password);
    }, [info.password]);

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
        setIsLoading(true);
        try {
            const requestBody = { ...info, middleName: info.middleName === "" ? null : info.middleName };
            const res = await api.put("/api/doctor/" + id, requestBody);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    navigate("/reload");
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This doctor is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate username");
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    // appointment
    const [showAppointment, setShowAppointment] = useState(false);
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
    const handleApmtTypeChange = (e: SelectChangeEvent) => {
        setApmntType(e.target.value as AppointmentType);
    };

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>{`${info.firstName} ${info.middleName ?? ""} ${info.lastName}`}</Header>
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
                        <label className={styles.infoLabel}>Role*</label>
                        {onEdit ? (
                            <Select
                                value={info.role}
                                onChange={(e) => setInfo({ ...info, role: e.target.value })}
                                size="small"
                                sx={{ paddingLeft: 0 }}
                                disabled={!onEdit}
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
                        ) : (
                            <div>
                                <Chip label={info.role} color={roleColorMap[info.role]} variant="outlined" />
                            </div>
                        )}
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
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Password*</label>
                        <input
                            type={onEdit ? "text" : "password"}
                            className={styles.infoInput}
                            value={info.password}
                            onChange={(e) => {
                                if (!engRegex.test(e.target.value)) return; // english only
                                setInfo({ ...info, password: e.target.value.trim() });
                            }}
                            disabled={!onEdit}
                        />
                    </div>
                    {onEdit && (
                        <>
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
                            <div className={styles.infoFooter}>
                                <button
                                    className={styles.cancelButton}
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
                        </>
                    )}
                </div>
                <div id="doctor-appointment">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <h3>Appointments</h3>
                        {!showAppointment && (
                            <button className={styles.button} onClick={() => setShowAppointment(true)}>
                                Show
                            </button>
                        )}
                    </div>
                    {showAppointment && (
                        <>
                            <Select value={apmtType} onChange={handleApmtTypeChange} size="small" sx={{ marginBottom: "10px" }}>
                                <MenuItem value="incoming">Incoming</MenuItem>
                                <MenuItem value="history">History</MenuItem>
                            </Select>
                            <AppointmentDataGrid
                                className={styles.datagridContainer}
                                sx={{ height: "50vh" }}
                                type={apmtType}
                                doctorId={info.id}
                            />
                        </>
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
    password: "-",
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

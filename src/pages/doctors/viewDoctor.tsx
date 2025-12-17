import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { CiTrash } from "react-icons/ci";
import GoBack from "../../components/goback";
import AppointmentDataGrid, { AppointmentType } from "../../components/datagrid/appointmentDataGrid";
import { Doctor } from "../../model/model";
import Loading from "../loading";
import { toast } from "react-toastify";
import { Checkbox, Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import DeleteDialog from "../../components/deleteDialog";
import { useAuthStore } from "../../stores/auth";
import { Permission } from "../../constants/permission";
import { useDoctorStore } from "../../stores/doctor";

interface PasswordCondition {
    length: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    numeric: boolean;
}

const engRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

export default function ViewDoctor() {
    // hook
    const { id } = useParams();
    const checkPermission = useAuthStore((state) => state.checkPermission);
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(true);
    const infoRef = useRef<Doctor>(); // save prevState on editing
    const [info, setInfo] = useState<Doctor>(initialInfo);
    const [pwdConditions, setPwdConditions] = useState<PasswordCondition>(initialPwdCondition);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [onChangePassword, setOnChangePassword] = useState(false);
    const [password, setPassword] = useState("");
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const getDoctor = useDoctorStore((state) => state.getDoctor);
    const updateDoctor = useDoctorStore((state) => state.updateDoctor);
    const deleteDoctor = useDoctorStore((state) => state.deleteDoctor);

    useEffect(() => {
        fetch();
    }, [id]);

    const fetch = async () => {
        if (!id) return;
        setIsLoading(true);
        const data = await getDoctor(id);
        setIsLoading(false);
        if (data) {
            infoRef.current = data;
            setInfo(data);
        } else if (data === null) navigate("/notFound");
    };

    useEffect(() => {
        checkConditions(password);
    }, [password]);

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

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;
        if (!formRef.current?.reportValidity()) return;
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
        const succeed = await updateDoctor(id, requestBody);
        setIsLoading(false);
        if (succeed) navigate("/reload");
    };

    const handleDelete = async () => {
        if (!id) return;
        setIsLoading(true);
        const succeed = await deleteDoctor(id);
        setIsLoading(false);
        if (succeed) navigate("/doctor");
    };

    useEffect(() => {
        // reset
        setPassword("");
        setConfirmPassword("");
        setOnChangePassword(false);
    }, [onEdit]);

    // appointment
    const [showAppointment, setShowAppointment] = useState(false);
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
    const handleApmtTypeChange = (e: SelectChangeEvent) => {
        setApmntType(e.target.value as AppointmentType);
    };

    if (isLoading) return <Loading />;
    return (
        <>
            <DeleteDialog deleteFunc={handleDelete} ref={deleteDialogRef} />
            <Header>{`${info.firstName} ${info.middleName ?? ""} ${info.lastName}`}</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Doctor Infomation</h3>
                        {!onEdit && (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    setOnEdit(true);
                                    infoRef.current = info;
                                }}
                                disabled={!checkPermission(Permission.updateDoctorPermission)}
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
                        ) : (
                            <div>
                                <Chip label={info.role} color={roleColorMap[info.role]} variant="outlined" />
                            </div>
                        )}
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
                            required
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
                                    type="password"
                                    className={styles.infoInput}
                                    value={password}
                                    onChange={(e) => {
                                        if (!engRegex.test(e.target.value)) return; // english only
                                        setPassword(e.target.value);
                                    }}
                                    disabled={!onEdit}
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
                                />
                            </div>
                        </>
                    )}
                    {onEdit && (
                        <div className={styles.infoFooter}>
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteDialogRef.current!.showModal();
                                }}
                                disabled={!checkPermission(Permission.deleteDoctorPermission)}
                            >
                                <CiTrash />
                                <span>Delete</span>
                            </button>
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
                </form>
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
                            <Select
                                value={apmtType}
                                onChange={handleApmtTypeChange}
                                size="small"
                                sx={{ marginBottom: "10px" }}
                            >
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

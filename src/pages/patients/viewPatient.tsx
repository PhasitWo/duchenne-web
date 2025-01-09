import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../../components/goback";
import AppointmentDataGrid, { AppointmentType } from "../../components/appointmentDataGrid";
import { Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import QuestionDataGrid from "../../components/questionDataGrid";
import { ErrResponse, Patient } from "../../model/model";
import { useAuthApiContext } from "../../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Loading from "../loading";

export default function ViewPatient() {
    const { id } = useParams();
    const { api } = useAuthApiContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState<Patient>(initialInfo);
    const infoRef = useRef<Patient>(); // save prevState on editing
    const [onEdit, setOnEdit] = useState(false);

    useEffect(() => {
        fetch();
    }, []);
    const fetch = useCallback(async () => {
        try {
            let res = await api.get<Patient>("/api/patient/" + id);
            switch (res.status) {
                case 200:
                    infoRef.current = res.data;
                    setInfo(res.data);
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

    const handleSave = async () => {
        if (info.hn.trim() === "" || info.firstName.trim() === "" || info.lastName.trim() === "") {
            toast.error("Not enough information");
            return;
        }
        if (info.phone && info.phone.length > 15) {
            toast.error("Phone number cannot exceed 15 digits");
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.put("/api/patient/" + id, info);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    navigate("/reload");
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate HN");
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
    // question
    const [showQuestion, setShowQuestion] = useState(false);

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>{`${info.firstName} ${info.middleName ?? ""} ${info.lastName}`}</Header>
            <div id="content-body">
                <GoBack />
                <div id="info-container" className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Patient Infomation</h3>
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
                        <label className={styles.infoLabel}>HN*</label>
                        <input type="text" className={styles.infoInput} value={info.hn} disabled />
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
                        <label className={styles.infoLabel}>Email</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.email ?? ""}
                            onChange={(e) => setInfo({ ...info, email: e.target.value.trim() })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Phone</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.phone ?? ""}
                            onChange={(e) => setInfo({ ...info, phone: e.target.value.trim() })}
                            disabled={!onEdit}
                            maxLength={15}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Status*</label>
                        {onEdit ? (
                            <Select
                                value={info.verified ? "verified" : "unverified"}
                                onChange={(e) => setInfo({ ...info, verified: e.target.value === "verified" })}
                                size="small"
                                sx={{ paddingLeft: 0 }}
                                disabled={!onEdit}
                            >
                                <MenuItem value="verified">
                                    <Chip label="verified" color="success" variant="outlined" />
                                </MenuItem>
                                <MenuItem value="unverified">
                                    <Chip label="unverified" color="error" variant="outlined" />
                                </MenuItem>
                            </Select>
                        ) : (
                            <div>
                                <Chip
                                    label={info.verified ? "verified" : "unverified"}
                                    color={info.verified ? "success" : "error"}
                                    variant="outlined"
                                />
                            </div>
                        )}
                    </div>
                    {onEdit && (
                        <div className={styles.infoFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setOnEdit(false);
                                    setInfo(infoRef.current as Patient);
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
                    )}
                </div>
                <div id="patient-appointment">
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
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
                                patientId={info.id}
                            />
                        </>
                    )}
                </div>
                <div id="patient-question">
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <h3>Questions</h3>
                        {!showQuestion && (
                            <button className={styles.button} onClick={() => setShowQuestion(true)}>
                                Show
                            </button>
                        )}
                    </div>
                    {showQuestion && <QuestionDataGrid className={styles.datagridContainer} sx={{ height: "50vh" }} />}
                </div>
            </div>
        </>
    );
}

const initialInfo: Patient = {
    id: -1,
    hn: "-",
    firstName: "-",
    middleName: "-",
    lastName: "-",
    email: "-",
    phone: "-",
    verified: false,
};

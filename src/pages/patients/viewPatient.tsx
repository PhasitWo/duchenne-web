import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import GoBack from "../../components/goback";
import AppointmentDataGrid, { AppointmentType } from "../../components/appointmentDataGrid";
import { Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import QuestionDataGrid, {
    QuestionType,
    sortCreateAtModel,
    sortAnswerAtModel,
} from "../../components/questionDataGrid";
import { Patient } from "../../model/model";
import { toast } from "react-toastify";
import Loading from "../loading";
import { GridSortModel } from "@mui/x-data-grid";
import { CiTrash } from "react-icons/ci";
import DeleteDialog from "../../components/deleteDialog";
import PatientMedicineSection from "../../components/patientMedicineSection";
import EditButton from "../../components/editButton";
import CancelButton from "../../components/cancelButton";
import SaveButton from "../../components/saveButton";
import PatientVaccineHistorySection from "../../components/patientVaccineHistorySection";
import { useAuthStore } from "../../stores/auth";
import { Permission } from "../../constants/permission";
import { usePatientStore } from "../../stores/patient";

export default function ViewPatient() {
    const { id } = useParams();
    const { checkPermission } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState<Patient>(initialInfo);
    const infoRef = useRef<Patient>(); // save prevState on editing
    const formRef = useRef<HTMLFormElement>(null);
    const [onEdit, setOnEdit] = useState(false);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const { getPatient, updatePatientGeneralInfo, deletePatient } = usePatientStore();

    useEffect(() => {
        fetch();
    }, [id]);

    const fetch = async () => {
        if (!id) return;
        setIsLoading(true);
        const data = await getPatient(id);
        setIsLoading(false);
        if (data) {
            infoRef.current = data;
            setInfo(data);
        } else if (data === null) {
            navigate("/notFound");
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;
        if (!formRef.current?.reportValidity()) return;
        if (info.hn.trim() === "" || info.firstName.trim() === "" || info.lastName.trim() === "") {
            toast.error("Not enough information");
            return;
        }
        if (info.phone && info.phone.length > 15) {
            toast.error("Phone number cannot exceed 15 digits");
            return;
        }
        const requestBody = {
            ...info,
            middleName: info.middleName === "" ? null : info.middleName,
            email: info.email === "" ? null : info.email,
            phone: info.middleName === "" ? null : info.middleName,
        };
        setIsLoading(true);
        const succeed = await updatePatientGeneralInfo(id, requestBody);
        setIsLoading(false);
        if (succeed) navigate("/reload");
    };

    const handleDelete = async () => {
        if (!id) return;
        setIsLoading(true);
        const succeed = await deletePatient(id);
        setIsLoading(false);
        if (succeed) navigate("/patient");
    };

    // appointment
    const [showAppointment, setShowAppointment] = useState(false);
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
    const handleApmtTypeChange = (e: SelectChangeEvent) => {
        setApmntType(e.target.value as AppointmentType);
    };
    // question
    const [showQuestion, setShowQuestion] = useState(false);
    const [questionType, setQuestionType] = useState<QuestionType>("unreplied");
    const [sortModel, setSortModel] = useState<GridSortModel>(sortCreateAtModel);
    const handleQuestionTypeChange = (e: SelectChangeEvent) => {
        if ((e.target.value as QuestionType) === "replied") {
            setSortModel(sortAnswerAtModel);
        } else {
            setSortModel(sortCreateAtModel);
        }
        setQuestionType(e.target.value as QuestionType);
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
                        <h3>Patient Infomation</h3>
                        {!onEdit && (
                            <EditButton
                                onClick={() => {
                                    setOnEdit(true);
                                    infoRef.current = info;
                                }}
                                disabled={!checkPermission(Permission.updatePatientPermission)}
                            />
                        )}
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>HN*</label>
                        <input type="text" className={styles.infoInput} value={info.hn} disabled required />
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
                        <label className={styles.infoLabel}>Weight</label>
                        <input
                            type="number"
                            className={styles.infoInput}
                            value={info.weight ?? ""}
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    weight: isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber,
                                })
                            }
                            disabled={!onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Height</label>
                        <input
                            type="number"
                            className={styles.infoInput}
                            value={info.height ?? ""}
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    height: isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber,
                                })
                            }
                            disabled={!onEdit}
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
                                required
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
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteDialogRef.current!.showModal();
                                }}
                                disabled={!checkPermission(Permission.deletePatientPermission)}
                            >
                                <CiTrash />
                                <span>Delete</span>
                            </button>
                            <div className={styles.infoCancelSaveContainer}>
                                <CancelButton
                                    onClick={() => {
                                        setOnEdit(false);
                                        setInfo(infoRef.current as Patient);
                                    }}
                                />
                                <SaveButton onClick={handleSave} />
                            </div>
                        </div>
                    )}
                </form>
                <PatientMedicineSection patient={infoRef.current ?? initialInfo} onUpdateComplete={fetch} />
                <PatientVaccineHistorySection patient={infoRef.current ?? initialInfo} onUpdateComplete={fetch} />
                <div id="patient-appointment">
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
                                patientId={info.id}
                            />
                        </>
                    )}
                </div>
                <div id="patient-question">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <h3>Questions</h3>
                        {!showQuestion && (
                            <button className={styles.button} onClick={() => setShowQuestion(true)}>
                                Show
                            </button>
                        )}
                    </div>
                    {showQuestion && (
                        <>
                            <Select
                                value={questionType}
                                onChange={handleQuestionTypeChange}
                                size="small"
                                sx={{ marginBottom: "10px" }}
                            >
                                <MenuItem value="unreplied">Unreplied</MenuItem>
                                <MenuItem value="replied">Replied</MenuItem>
                            </Select>
                            <QuestionDataGrid
                                className={styles.datagridContainer}
                                sx={{ height: "50vh" }}
                                sortModel={sortModel}
                                type={questionType}
                                patientId={info.id}
                            />
                        </>
                    )}
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
    medicine: null,
    vaccineHistory: null,
    height: null,
    weight: null,
};

import { useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../../components/goback";
import AppointmentDataGrid from "../../components/appointmentDataGrid";

interface Info {
    id: number | string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    username: string;
    password: string;
}

export default function ViewDoctor() {
    const { id } = useParams();
    const [info, setInfo] = useState<Info>(initialInfo);
    const infoRef = useRef<Info>(); // save prevState on editing
    const [onEdit, setOnEdit] = useState(false);
    const [showAppointment, setShowAppointment] = useState(false);

    return (
        <>
            <Header>This is view doctor/{id}</Header>
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
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.role}
                            onChange={(e) => setInfo({ ...info, role: e.target.value })}
                            disabled={!onEdit}
                        />
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
                            onChange={(e) => setInfo({ ...info, password: e.target.value })}
                            disabled={!onEdit}
                        />
                    </div>
                    {onEdit && (
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
                    )}
                </div>
                <div id="doctor-appointment">
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <h3>Appointments</h3>
                        {!showAppointment && (
                            <button className={styles.button} onClick={() => setShowAppointment(true)}>
                                Show
                            </button>
                        )}
                    </div>
                    {showAppointment && <AppointmentDataGrid className={styles.datagridContainer} sx={{ height: "50vh" }} />}
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
    password: "-",
};

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import styles from "../styles/common.module.css";
import Header from "../components/header";
import { AiOutlineSchedule } from "react-icons/ai";
import AppointmentDataGrid from "../components/datagrid/appointmentDataGrid";
import { AppointmentType } from "../components/datagrid/appointmentDataGrid";
import AddButton from "../components/addButton";
import CreateAppointmentModal from "../components/modal/createAppointmentModal";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

type AppointmentOwner = "myappointment" | "allappointment";

export default function Appointments() {
    const [apmtOwner, setApmntOwner] = useState<AppointmentOwner>("allappointment");
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
    const { userData } = useAuthStore();
    const [openCreate, setOpenCreate] = useState(false);
    const navigate = useNavigate();

    const handleApmtOwnerChange = (e: SelectChangeEvent) => {
        setApmntOwner(e.target.value as AppointmentOwner);
    };
    const handleApmtTypeChange = (e: SelectChangeEvent) => {
        setApmntType(e.target.value as AppointmentType);
    };
    return (
        <>
            <Header>
                <AiOutlineSchedule />
                Appointments
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={s.actionRow}>
                        <div>
                            <Select value={apmtOwner} onChange={handleApmtOwnerChange} size="small">
                                <MenuItem value="myappointment">My Appointments</MenuItem>
                                <MenuItem value="allappointment">All Appointments</MenuItem>
                            </Select>
                            <Select
                                value={apmtType}
                                onChange={handleApmtTypeChange}
                                size="small"
                                sx={{ marginLeft: "10px" }}
                            >
                                <MenuItem value="incoming">Incoming</MenuItem>
                                <MenuItem value="history">History</MenuItem>
                            </Select>
                        </div>
                        <AddButton style={{ marginLeft: "10px" }} onClick={() => setOpenCreate(true)} />
                    </div>
                    <AppointmentDataGrid
                        className={styles.datagrid}
                        type={apmtType}
                        doctorId={apmtOwner === "myappointment" ? userData.doctorId : undefined}
                    />
                </div>
                <CreateAppointmentModal
                    open={openCreate}
                    setOpen={setOpenCreate}
                    onComplete={() => navigate("/reload")}
                />
            </div>
        </>
    );
}

const s: { [key: string]: React.CSSProperties } = {
    actionRow: {
        marginTop: "10px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
    },
};

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import styles from "../styles/common.module.css";
import { Translate } from "../hooks/languageContext";
import Header from "../components/header";
import { AiOutlineSchedule } from "react-icons/ai";
import AppointmentDataGrid from "../components/appointmentDataGrid";
import { AppointmentType } from "../components/appointmentDataGrid";
import { useAuthApiContext } from "../hooks/authApiContext";

type AppointmentOwner = "myappointment" | "allappointment";

export default function Appointments() {
    const [apmtOwner, setApmntOwner] = useState<AppointmentOwner>("myappointment");
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
    const { userData } = useAuthApiContext();
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
                <Translate token="Appointments" />
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
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
                    <div
                        style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {/* <label>
                            <Translate token="Search" />
                        </label>
                        <input type="text" className={styles.searchInput} style={{ flex: 1 }} placeholder="id / name" /> */}
                    </div>
                    <AppointmentDataGrid
                        className={styles.datagrid}
                        type={apmtType}
                        doctorId={apmtOwner === "myappointment" ? userData.doctorId : undefined}
                    />
                </div>
            </div>
        </>
    );
}

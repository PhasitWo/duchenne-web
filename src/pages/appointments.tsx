import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "../styles/common.module.css";
import { Translate } from "../hooks/LanguageContext";
import dayjs from "dayjs";
import Header from "../components/header";
import { AiOutlineSchedule } from "react-icons/ai";

type AppointmentOwner = "myappointment" | "allappointment";
type AppointmentType = "incoming" | "history";

const mockup: GridRowsProp = [
    { id: 1, patientName: "Jingjai bindai", doctorName: "Dr.Earth", createAt: 1734268740, date: 1734278740 },
    { id: 2, patientName: "Superman Batman", doctorName: "Dr.Earth", createAt: 1734268540, date: 1734288740 },
    { id: 3, patientName: "Kawin Bindai Mario", doctorName: "Dr.Ploy", createAt: 1734264740, date: 1734968740 },
];

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "patientName", headerName: "Patient", flex: 2 },
    { field: "doctorName", headerName: "Doctor", flex: 2 },
    { field: "createAt", headerName: "Create At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
    { field: "date", headerName: "Appointment Date", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
];

export default function Appointments() {
    const [apmtOwner, setApmntOwner] = useState<AppointmentOwner>("myappointment");
    const [apmtType, setApmntType] = useState<AppointmentType>("incoming");
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
                    <Select value={apmtType} onChange={handleApmtTypeChange} size="small" sx={{ marginLeft: "10px" }}>
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
                        <label>
                            <Translate token="Search" />
                        </label>
                        <input type="text" className={styles.input} style={{ flex: 1 }} placeholder="id / name" />
                    </div>
                    <DataGrid
                        rows={mockup}
                        columns={columns}
                        className={styles.datagrid}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "date", sort: "desc" }],
                            },
                        }}
                    />
                </div>
            </div>
        </>
    );
}

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import styles from "../styles/common.module.css";
import Chip from "@mui/material/Chip";
import { Translate } from "../hooks/LanguageContext";

const mockup: GridRowsProp = [
    { hn: "test1", name: "Jingjai bindai", email: "dunno@gmail.com", phone: "000000", verified: true },
    { hn: "test2", name: "Superman Batman", email: "dunno@gmail.com", phone: "000000", verified: true },
    { hn: "test3", name: "Kawin Bindai Mario", email: "dunno@gmail.com", phone: "000000", verified: false },
];

const columns: GridColDef[] = [
    { field: "hn", headerName: "HN", width: 100 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "phone", headerName: "Phone", flex: 2 },
    {
        field: "verified",
        headerName: "Verified",
        flex: 1,
        valueOptions: ["verified", "unverified"],
        valueGetter: (_, r) => {
            return r.verified ? "verified" : "unverified";
        },
        renderCell: (v) => <Chip label={v.value} color={v.value == "verified" ? "success" : "error"} variant="outlined" />,
    },
];

export default function Patients() {
    return (
        <>
            <div style={{ marginBottom: "10px", width: "60vw", display: "flex", alignItems: "center" }}>
                <label>
                    <Translate token="Search" />
                </label>
                <input type="text" className={styles.input} style={{ flex: 1 }} placeholder="id / name" />
                <button className={styles.button} style={{ marginLeft: "10px" }}>
                    <Translate token="+ Add" />
                </button>
            </div>
            <DataGrid rows={mockup} columns={columns} style={{ width: "60vw", height: "70vh" }} getRowId={(r) => r.hn} />
        </>
    );
}

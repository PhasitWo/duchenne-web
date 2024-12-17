import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import styles from "../../styles/common.module.css";
import Chip from "@mui/material/Chip";
import { Translate } from "../../hooks/LanguageContext";
import Header from "../../components/header";
import { BsPersonLinesFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const mockup: GridRowsProp = [
    { hn: "test1", name: "Jingjai bindai", email: "dunno@gmail.com", phone: "000000", verified: true },
    { hn: "test2", name: "Superman Batman", email: "dunno@gmail.com", phone: "000000", verified: true },
    { hn: "test3", name: "Kawin Bindai Mario", email: "dunno@gmail.com", phone: "000000", verified: false },
];

const columns: GridColDef[] = [
    { field: "hn", headerName: "HN", width: 100 },
    { field: "name", headerName: "Name", flex: 2, renderCell: (v) => <NavLink to={`/patient/${v.row.hn}`}>{v.value}</NavLink> },
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
            <Header>
                <BsPersonLinesFill />
                <Translate token="Patients" />
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>
                            <Translate token="Search" />
                        </label>
                        <input type="text" className={styles.searchInput} style={{ flex: 1 }} placeholder="id / name" />
                        <button className={styles.button} style={{ marginLeft: "10px" }}>
                            <Translate token="+ Add" />
                        </button>
                    </div>
                    <DataGrid rows={mockup} columns={columns} className={styles.datagrid} getRowId={(r) => r.hn} />
                </div>
            </div>
        </>
    );
}

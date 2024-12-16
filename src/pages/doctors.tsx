import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import styles from "../styles/common.module.css";
import { Translate } from "../hooks/LanguageContext";
import Header from "../components/header";
import { FaUserDoctor } from "react-icons/fa6";

const mockup: GridRowsProp = [
    { id: 1, name: "haha", role: "admin" },
    { id: 2, name: "asd", role: "user" },
    { id: 3, name: "123", role: "root" },
];

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
];

export default function Doctors() {
    return (
        <>
            <Header>
                <FaUserDoctor/>
                <Translate token="Doctors" />
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>
                            <Translate token="Search" />
                        </label>
                        <input type="text" className={styles.input} style={{ flex: 1 }} placeholder="id / name" />
                        <button className={styles.button} style={{ marginLeft: "10px" }}>
                            <Translate token="+ Add" />
                        </button>
                    </div>
                    <DataGrid rows={mockup} columns={columns} className={styles.datagrid} />
                </div>
            </div>
        </>
    );
}

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "../../styles/common.module.css";
import Chip from "@mui/material/Chip";
import Header from "../../components/header";
import { BsPersonLinesFill } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Patient } from "../../model/model";
import AddButton from "../../components/addButton";
import { Permission } from "../../constants/permission";
import { useAuthStore } from "../../stores/auth";
import { usePatientStore } from "../../stores/patient";

const columns: GridColDef<Patient>[] = [
    { field: "hn", headerName: "HN", width: 100 },
    {
        field: "name",
        headerName: "Name",
        flex: 2,
        valueGetter: (_, r) => `${r.firstName} ${r.middleName ?? ""} ${r.lastName}`,
        renderCell: (v) => (
            <NavLink to={`/patient/${v.row.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "phone", headerName: "Phone", flex: 2 },
    { field: "weight", headerName: "Weight(kg)", flex: 1 },
    { field: "height", headerName: "Height(cm)", flex: 1 },
    {
        field: "verified",
        headerName: "Verified",
        flex: 1,
        valueOptions: ["verified", "unverified"],
        valueGetter: (_, r) => {
            return r.verified ? "verified" : "unverified";
        },
        renderCell: (v) => (
            <Chip label={v.value} color={v.value == "verified" ? "success" : "error"} variant="outlined" />
        ),
    },
];

export default function Patients() {
    const navigate = useNavigate();
    const { checkPermission } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const initialRows = useRef<Patient[]>([]);
    const [rows, setRows] = useState<Patient[]>([]);
    const { listPatients } = usePatientStore();

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        setIsLoading(true);
        const data = await listPatients();
        setRows(data);
        setIsLoading(false);
    };
    useEffect(() => {
        let result: Patient[] = [];
        try {
            result = initialRows.current.filter(
                (v) =>
                    (v.firstName + v.middleName + v.lastName).search(RegExp(searchText, "i")) != -1 ||
                    v.hn.search(RegExp(searchText, "i")) != -1
            );
        } catch (e) {
            console.log(e);
        } finally {
            setRows(result);
        }
    }, [searchText]);
    return (
        <>
            <Header>
                <BsPersonLinesFill />
                Patients
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>
                            Search
                        </label>
                        <input
                            type="text"
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                            placeholder="HN / Name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <AddButton
                            style={{ marginLeft: "10px" }}
                            onClick={() => navigate("new")}
                            disabled={!checkPermission(Permission.createPatientPermission)}
                        />
                    </div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        className={styles.datagrid}
                        getRowId={(r) => r.hn}
                        loading={isLoading}
                    />
                </div>
            </div>
        </>
    );
}

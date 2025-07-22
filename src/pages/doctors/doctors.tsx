import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "../../styles/common.module.css";
import Header from "../../components/header";
import { FaUserDoctor } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { TrimDoctor } from "../../model/model";
import AddButton from "../../components/addButton";
import { useAuthStore } from "../../stores/auth";
import { Permission } from "../../constants/permission";
import { useDoctorStore } from "../../stores/doctor";

const columns: GridColDef<TrimDoctor>[] = [
    { field: "id", headerName: "ID", width: 100 },
    {
        field: "name",
        headerName: "Name",
        flex: 1,
        valueGetter: (_, r) => `${r.firstName} ${r.middleName ?? ""} ${r.lastName}`,
        renderCell: (v) => (
            <NavLink to={`/doctor/${v.row.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "specialist", headerName: "Specialist", flex: 1 },
];

export default function Doctors() {
    const navigate = useNavigate();
    const { checkPermission } = useAuthStore();
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<TrimDoctor[]>([]);
    const initialRows = useRef<TrimDoctor[]>([]);
    const { listDoctors } = useDoctorStore();

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        setIsLoading(true);
        const data = await listDoctors();
        initialRows.current = data;
        setRows(data);
        setIsLoading(false);
    };

    useEffect(() => {
        let result: TrimDoctor[] = [];
        try {
            result = initialRows.current.filter(
                (v) =>
                    (v.firstName + v.middleName + v.lastName).search(RegExp(searchText, "i")) != -1 ||
                    String(v.id).search(RegExp(searchText, "i")) != -1
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
                <FaUserDoctor />
                Doctor
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>Search</label>
                        <input
                            type="text"
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                            placeholder="ID / Name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <AddButton
                            style={{ marginLeft: "10px" }}
                            onClick={() => navigate("new")}
                            disabled={!checkPermission(Permission.createDoctorPermission)}
                        />
                    </div>
                    <DataGrid rows={rows} columns={columns} className={styles.datagrid} loading={isLoading} />
                </div>
            </div>
        </>
    );
}

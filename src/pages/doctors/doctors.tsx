import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "../../styles/common.module.css";
import { Translate } from "../../hooks/LanguageContext";
import Header from "../../components/header";
import { FaUserDoctor } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ErrResponse, TrimDoctor } from "../../model/model";
import { Permission, useAuthApiContext } from "../../hooks/authApiContext";
import { AxiosError } from "axios";
import AddButton from "../../components/addButton";

// const mockup: GridRowsProp = [
//     { id: 1, name: "haha", role: "admin" },
//     { id: 2, name: "asd", role: "user" },
//     { id: 3, name: "123", role: "root" },
// ];

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
    const { api, checkPermission } = useAuthApiContext();
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<TrimDoctor[]>([]);
    const initialRows = useRef<TrimDoctor[]>([]);
    useEffect(() => {
        fetch();
    }, []);
    const fetch = async () => {
        try {
            let res = await api.get<TrimDoctor[]>("/api/doctor");
            switch (res.status) {
                case 200:
                    initialRows.current = res.data;
                    setRows(res.data);
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let result: TrimDoctor[] = [];
        try {
            result = initialRows.current.filter(
                (v) =>
                    (v.firstName + v.middleName + v.lastName).search(RegExp(searchText, "i")) !=
                        -1 || String(v.id).search(RegExp(searchText, "i")) != -1
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
                <Translate token="Doctors" />
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>
                            <Translate token="Search" />
                        </label>
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
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        className={styles.datagrid}
                        loading={isLoading}
                    />
                </div>
            </div>
        </>
    );
}

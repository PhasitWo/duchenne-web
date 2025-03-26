import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "../../styles/common.module.css";
import Chip from "@mui/material/Chip";
import { Translate } from "../../hooks/languageContext";
import Header from "../../components/header";
import { BsPersonLinesFill } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Permission, useAuthApiContext } from "../../hooks/authApiContext";
import { ErrResponse, Patient } from "../../model/model";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import AddButton from "../../components/addButton";

// const mockup: GridRowsProp = [
//     { hn: "test1", name: "Jingjai bindai", email: "dunno@gmail.com", phone: "000000", verified: true },
//     { hn: "test2", name: "Superman Batman", email: "dunno@gmail.com", phone: "000000", verified: true },
//     { hn: "test3", name: "Kawin Bindai Mario", email: "dunno@gmail.com", phone: "000000", verified: false },
// ];

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
    {
        field: "verified",
        headerName: "Verified",
        flex: 1,
        valueOptions: ["verified", "unverified"],
        valueGetter: (_, r) => {
            return r.verified ? "verified" : "unverified";
        },
        renderCell: (v) => (
            <Chip
                label={v.value}
                color={v.value == "verified" ? "success" : "error"}
                variant="outlined"
            />
        ),
    },
];

export default function Patients() {
    const { api, checkPermission } = useAuthApiContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const initialRows = useRef<Patient[]>([]);
    const [rows, setRows] = useState<Patient[]>([]);
    useEffect(() => {
        fetch();
    }, []);
    const fetch = async () => {
        try {
            let res = await api.get<Patient[]>("/api/patient");
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
        let result: Patient[] = [];
        try {
            result = initialRows.current.filter(
                (v) =>
                    (v.firstName + v.middleName + v.lastName).search(RegExp(searchText, "i")) !=
                        -1 || v.hn.search(RegExp(searchText, "i")) != -1
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
                <Translate token="Patients" />
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

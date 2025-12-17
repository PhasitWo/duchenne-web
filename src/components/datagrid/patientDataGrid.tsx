import { DataGrid, GridColDef, GridPaginationModel, type DataGridProps } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Patient } from "../../model/model";
import { NavLink } from "react-router-dom";
import styles from "../../styles/common.module.css";
import { unixToYears } from "../../utils";
import Chip from "@mui/material/Chip";
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
        field: "birthDate",
        headerName: "Age",
        flex: 1,
        valueFormatter: (_, r) => unixToYears(r.birthDate),
    },
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

export default function PatientDataGrid({
    localSearch,
    ...rest
}: Omit<DataGridProps, "columns"> & { localSearch?: string }) {
    const [rows, setRows] = useState<Patient[]>([]);
    const initialRows = useRef<Patient[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const listPatients = usePatientStore((state) => state.listPatients);

    useEffect(() => {
        fetch(paginationModel.pageSize, 0);
    }, []);

    useEffect(() => {
        let result: Patient[] = [];
        if (!localSearch) {
            setRows(initialRows.current);
            return;
        }
        try {
            result = initialRows.current.filter(
                (v) =>
                    (v.firstName + v.middleName + v.lastName).search(RegExp(localSearch, "i")) != -1 ||
                    String(v.id).search(RegExp(localSearch, "i")) != -1
            );
        } catch (e) {
            console.log(e);
        } finally {
            setRows(result);
        }
    }, [localSearch]);

    const handlePaginationModelChange = async (model: GridPaginationModel) => {
        await fetch(model.pageSize, model.page * model.pageSize);
        setPaginationModel(model);
    };

    const fetch = async (limit: number, offset: number) => {
        setIsLoading(true);
        const result = await listPatients(limit, offset);
        initialRows.current = result.data;
        setIsLoading(false);
        setRows(result.data);
        setHasNextPage(result.hasNextPage);
    };

    return (
        <>
            <DataGrid
                {...rest}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "date", sort: "asc" }],
                    },
                }}
                rows={rows}
                columns={columns}
                rowCount={hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + rows.length}
                paginationMeta={{ hasNextPage: hasNextPage }}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[10, 20, 50]}
                loading={isLoading}
            />
        </>
    );
}

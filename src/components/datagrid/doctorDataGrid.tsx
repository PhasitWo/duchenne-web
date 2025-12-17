import { DataGrid, GridColDef, GridPaginationModel, type DataGridProps } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { TrimDoctor } from "../../model/model";
import { CiCircleCheck } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import styles from "../../styles/common.module.css";
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
    {
        field: "canBeAppointed",
        headerName: "Can Be Appointed",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (v) =>
            v.row.canBeAppointed ? <CiCircleCheck color="green" size={24} /> : <CiCircleRemove color="red" size={24} />,
    },
    { field: "specialist", headerName: "Specialist", flex: 1 },
];

export default function DoctorDataGrid({
    localSearch,
    ...rest
}: Omit<DataGridProps, "columns"> & { localSearch?: string }) {
    const [rows, setRows] = useState<TrimDoctor[]>([]);
    const initialRows = useRef<TrimDoctor[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const listDoctors = useDoctorStore((state) => state.listDoctors);

    useEffect(() => {
        fetch(paginationModel.pageSize, 0);
    }, []);

    useEffect(() => {
        let result: TrimDoctor[] = [];
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
        const result = await listDoctors(limit, offset);
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

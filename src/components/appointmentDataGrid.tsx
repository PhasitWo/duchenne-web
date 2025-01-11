import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    type DataGridProps,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Appointment, ErrResponse } from "../model/model";
import { useAuthApiContext } from "../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import styles from "../styles/common.module.css"

export type AppointmentType = "incoming" | "history";

interface AppointmentDataGridProps {
    type: AppointmentType;
    doctorId?: number;
    patientId?: number;
}

const columns: GridColDef<Appointment>[] = [
    { field: "id", headerName: "ID", width: 100 },
    {
        field: "patientName",
        headerName: "Patient",
        flex: 2,
        valueGetter: (_, r) =>
            `${r.patient.firstName} ${r.patient.middleName ?? ""} ${r.patient.lastName}`,
        renderCell: (v) => (
            <NavLink to={`/patient/${v.row.patient.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },
    {
        field: "doctorName",
        headerName: "Doctor",
        flex: 2,
        valueGetter: (_, r) =>
            `${r.doctor.firstName} ${r.doctor.middleName ?? ""} ${r.doctor.lastName}`,
        renderCell: (v) => (
            <NavLink to={`/doctor/${v.row.doctor.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },
    {
        field: "createAt",
        headerName: "Create At",
        flex: 2,
        valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
    },
    {
        field: "date",
        headerName: "Appointment Date",
        flex: 2,
        valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
    },
];

export default function AppointmentDataGrid({
    type = "incoming",
    doctorId,
    patientId,
    ...rest
}: Omit<DataGridProps, "columns"> & AppointmentDataGridProps) {
    const [rows, setRows] = useState<Appointment[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { api } = useAuthApiContext();

    const handlePaginationModelChange = async (model: GridPaginationModel) => {
        await fetch(model.pageSize, model.page * model.pageSize);
        setPaginationModel(model);
    };

    useEffect(() => {
        setPaginationModel({ ...paginationModel, page: 0 });
        fetch(paginationModel.pageSize, 0);
    }, [type, doctorId, patientId]);

    const attachQueryParams = (url: string, limit: number, offset: number) => {
        url +=
            `?type=${type}` +
            (doctorId ? `&doctorId=${doctorId}` : "") +
            (patientId ? `&patientId=${patientId}` : "") +
            `&limit=${limit}` +
            `&offset=${offset}`;
        return url;
    };
    const fetch = async (limit: number, offset: number) => {
        setIsLoading(true);
        try {
            let res = await api.get<Appointment[]>(
                attachQueryParams("/api/appointment", limit + 1, offset)
            );
            switch (res.status) {
                case 200:
                    if (res.data.length == limit + 1) {
                        res.data.pop()
                        setHasNextPage(true)
                    } else {
                        setHasNextPage(false)
                    }
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
    return (
        <DataGrid
            {...rest}
            initialState={{
                sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                },
            }}
            rows={rows}
            columns={columns}
            rowCount={hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + rows.length}
            paginationMeta={{ hasNextPage: hasNextPage }}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5, 10, 20, 50]}
            loading={isLoading}
        />
    );
}

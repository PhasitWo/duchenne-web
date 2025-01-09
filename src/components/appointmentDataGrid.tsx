import { DataGrid, GridColDef, type DataGridProps } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Appointment, ErrResponse } from "../model/model";
import { useAuthApiContext } from "../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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
        valueGetter: (_, r) => `${r.patient.firstName} ${r.patient.middleName ?? ""} ${r.patient.lastName}`,
    },
    {
        field: "doctorName",
        headerName: "Doctor",
        flex: 2,
        valueGetter: (_, r) => `${r.doctor.firstName} ${r.doctor.middleName ?? ""} ${r.doctor.lastName}`,
    },
    { field: "createAt", headerName: "Create At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
    { field: "date", headerName: "Appointment Date", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
];

export default function AppointmentDataGrid({
    type = "incoming",
    doctorId,
    patientId,
    ...rest
}: Omit<DataGridProps, "columns"> & AppointmentDataGridProps) {
    const [rows, setRows] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { api } = useAuthApiContext();

    useEffect(() => {
        fetch();
    }, [type, doctorId, patientId]);
    const attachQueryParams = (url: string) => {
        url += `?type=${type}` + (doctorId ? `&doctorId=${doctorId}` : "") + (patientId ? `&patientId=${patientId}` : "");
        return url;
    };
    const fetch = async () => {
        setIsLoading(true);
        try {
            let res = await api.get<Appointment[]>(attachQueryParams("/api/appointment"));
            switch (res.status) {
                case 200:
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
            rows={rows}
            columns={columns}
            initialState={{
                sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                },
            }}
            loading={isLoading}
        />
    );
}

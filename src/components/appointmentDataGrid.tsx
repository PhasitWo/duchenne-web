import { DataGrid, GridColDef, type DataGridProps } from "@mui/x-data-grid";
import dayjs from "dayjs";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "patientName", headerName: "Patient", flex: 2 },
    { field: "doctorName", headerName: "Doctor", flex: 2 },
    { field: "createAt", headerName: "Create At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
    { field: "date", headerName: "Appointment Date", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
];


export default function AppointmentDataGrid({ ...rest }: Omit<DataGridProps, "columns">) {
    return (
        <DataGrid
            {...rest}
            columns={columns}
            initialState={{
                sorting: {
                    sortModel: [{ field: "date", sort: "desc" }],
                },
            }}
        />
    );
}

import { DataGrid, GridColDef, type DataGridProps } from "@mui/x-data-grid";
import dayjs from "dayjs";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "topic", headerName: "Topic", flex: 3.5 },
    { field: "patientName", headerName: "Patient", flex: 2 },
    { field: "createAt", headerName: "Create At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
    { field: "doctorName", headerName: "Doctor", flex: 2, valueFormatter: (v) => (v ? v : "none") },
    {
        field: "answerAt",
        headerName: "Answer At",
        flex: 2,
        valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
        renderCell: (v) => (v.row.answerAt ? v.value : "none"),
    },
];

export default function QuestionDataGrid({ ...rest }: Omit<DataGridProps, "columns">) {
    return (
        <DataGrid
            {...rest}
            columns={columns}
        />
    );
}

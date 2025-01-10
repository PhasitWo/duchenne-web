import { DataGrid, GridColDef, GridSortModel, type DataGridProps } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { NavLink } from "react-router-dom";
import styles from "../styles/common.module.css";
import { ErrResponse, QuestionTopic } from "../model/model";
import { useEffect, useState } from "react";
import { useAuthApiContext } from "../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export type QuestionType = "replied" | "unreplied";

interface QuestionDataGridProps {
    type: QuestionType;
    doctorId?: number;
    patientId?: number;
}

export const sortCreateAtModel: GridSortModel = [{ field: "createAt", sort: "asc" }];
export const sortAnswerAtModel: GridSortModel = [{ field: "answerAt", sort: "desc" }];

const columns: GridColDef<QuestionTopic>[] = [
    { field: "id", headerName: "ID", width: 50 },
    {
        field: "topic",
        headerName: "Topic",
        flex: 3.5,
        renderCell: (v) => (
            <NavLink to={`/question/${v.row.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },
    {
        field: "patientName",
        headerName: "Patient",
        flex: 2,
        valueGetter: (_, r) => `${r.patient.firstName} ${r.patient.middleName ?? ""} ${r.patient.lastName}`,
    },
    {
        field: "createAt",
        headerName: "Create At",
        flex: 2,
        type: "date",
        valueGetter: (_, r) => dayjs(r.createAt * 1000),
        valueFormatter: (v) => (v as Dayjs).format("DD/MM/YY HH:mm"),
    },
    {
        field: "doctorName",
        headerName: "Doctor",
        flex: 2,
        valueGetter: (_, r) => (r.doctor ? `${r.doctor.firstName} ${r.doctor.middleName ?? ""} ${r.doctor.lastName}` : null),
        valueFormatter: (v) => (v ? v : "none"),
    },
    {
        field: "answerAt",
        headerName: "Answer At",
        flex: 2,
        type: "date",
        valueGetter: (_, r) => (r.answerAt ? dayjs(r.answerAt * 1000) : null),
        valueFormatter: (v) => (v ? (v as Dayjs).format("DD/MM/YY HH:mm") : "none"),
    },
];

export default function QuestionDataGrid({
    type = "unreplied",
    doctorId,
    patientId,
    ...rest
}: Omit<DataGridProps, "columns"> & QuestionDataGridProps) {
    const { api } = useAuthApiContext();
    const [rows, setRows] = useState<QuestionTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            let res = await api.get<QuestionTopic[]>(attachQueryParams("/api/question"));
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
    return <DataGrid {...rest} rows={rows} columns={columns} loading={isLoading} />;
}

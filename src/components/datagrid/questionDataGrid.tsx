import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, type DataGridProps } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { NavLink } from "react-router-dom";
import styles from "../../styles/common.module.css";
import { QuestionTopic } from "../../model/model";
import { useEffect, useState } from "react";
import { useQuestionStore } from "../../stores/question";

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
        renderCell: (v) => (
            <NavLink to={`/patient/${v.row.patient.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
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
        valueGetter: (_, r) =>
            r.doctor ? `${r.doctor.firstName} ${r.doctor.middleName ?? ""} ${r.doctor.lastName}` : null,
        renderCell: (v) =>
            v.row.doctor ? (
                <NavLink to={`/doctor/${v.row.doctor.id}`} className={styles.navLink}>
                    {v.value}
                </NavLink>
            ) : (
                "none"
            ),
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
    const [rows, setRows] = useState<QuestionTopic[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { listQuestions } = useQuestionStore();

    const handlePaginationModelChange = async (model: GridPaginationModel) => {
        await fetch(model.pageSize, model.page * model.pageSize);
        setPaginationModel(model);
    };

    useEffect(() => {
        setPaginationModel({ ...paginationModel, page: 0 });
        fetch(paginationModel.pageSize, 0);
    }, [type, doctorId, patientId]);

    const fetch = async (limit: number, offset: number) => {
        setIsLoading(true);
        const { data, hasNextPage } = await listQuestions({ limit, offset, type, doctorId, patientId });
        setRows(data);
        setHasNextPage(hasNextPage);
        setIsLoading(false);
    };
    return (
        <DataGrid
            {...rest}
            columns={columns}
            rowCount={hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + rows.length}
            rows={rows}
            paginationMeta={{ hasNextPage: hasNextPage }}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5, 10, 20, 50]}
            loading={isLoading}
        />
    );
}

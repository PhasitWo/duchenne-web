import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "../styles/common.module.css";
import { Translate } from "../hooks/LanguageContext";
import dayjs from "dayjs";
import Header from "../components/header";

type QuestionType = "unreplied" | "replied";

const mockup: GridRowsProp = [
    {
        id: 1,
        patientName: "Jingjai bindai",
        topic: "What is Love",
        createAt: 1734268740,
        doctorName: "Dr.Earth",
        answerAt: 1734278740,
    },
    {
        id: 2,
        patientName: "Superman Batman",
        topic: "asdqwe asdasw asd",
        createAt: 1734268540,
        doctorName: null,
        answerAt: null,
    },
    {
        id: 3,
        patientName: "Kawin Bindai Mario",
        topic: "long topic asdkas;k;qwkeqw asdk;laskd;lks",
        createAt: 1734264740,
        doctorName: null,
        answerAt: null,
    },
];

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "patientName", headerName: "Patient", flex: 2 },
    { field: "topic", headerName: "Topic", flex: 2 },
    { field: "createAt", headerName: "Create At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm") },
    { field: "doctorName", headerName: "Doctor", flex: 2, valueFormatter: (v) => v ? v : "none" },
    { field: "answerAt", headerName: "Answer At", flex: 2, valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"), renderCell:(v) => v.row.answerAt ? v.value : "none" },
];

export default function Questions() {
    const [questionType, setQuestionType] = useState<QuestionType>("unreplied");
    const handleQuestionTypeChange = (e: SelectChangeEvent) => {
        setQuestionType(e.target.value as QuestionType);
    };
    return (
        <>
            <Header />
            <div id="content-body">
                <Select value={questionType} onChange={handleQuestionTypeChange} size="small">
                    <MenuItem value="unreplied">Unreplied</MenuItem>
                    <MenuItem value="replied">Replied</MenuItem>
                </Select>
                <div
                    style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        width: "60vw",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <label>
                        <Translate token="Search" />
                    </label>
                    <input type="text" className={styles.input} style={{ flex: 1 }} placeholder="id / name" />
                </div>
                <DataGrid
                    rows={mockup}
                    columns={columns}
                    style={{ width: "60vw", height: "70vh" }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "date", sort: "desc" }],
                        },
                    }}
                />
            </div>
        </>
    );
}

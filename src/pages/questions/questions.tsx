import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GridSortModel } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "../../styles/common.module.css";
import Header from "../../components/header";
import { CiCircleQuestion } from "react-icons/ci";
import QuestionDataGrid from "../../components/datagrid/questionDataGrid";
import { QuestionType, sortCreateAtModel, sortAnswerAtModel } from "../../components/datagrid/questionDataGrid";
import { useAuthStore } from "../../stores/auth";

type QuestionOwner = "myquestion" | "allquestion";

export default function Questions() {
    const [questionOwner, setQuestionOwner] = useState<QuestionOwner>("allquestion");
    const [questionType, setQuestionType] = useState<QuestionType>("unreplied");
    const [sortModel, setSortModel] = useState<GridSortModel>(sortCreateAtModel);
    const { userData } = useAuthStore();

    const handleQuestionOwnerChange = (e: SelectChangeEvent) => {
        if ((e.target.value as QuestionOwner) === "myquestion") {
            setQuestionType("replied");
            setSortModel(sortAnswerAtModel);
        } else {
            setQuestionType("unreplied");
            setSortModel(sortCreateAtModel);
        }
        setQuestionOwner(e.target.value as QuestionOwner);
    };
    const handleQuestionTypeChange = (e: SelectChangeEvent) => {
        if ((e.target.value as QuestionType) === "replied") {
            setSortModel(sortAnswerAtModel);
        } else {
            setSortModel(sortCreateAtModel);
        }
        setQuestionType(e.target.value as QuestionType);
    };
    return (
        <>
            <Header>
                <CiCircleQuestion />
                Questions
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <Select value={questionOwner} onChange={handleQuestionOwnerChange} size="small">
                        <MenuItem value="allquestion">All Questions</MenuItem>
                        <MenuItem value="myquestion">My Questions</MenuItem>
                    </Select>
                    <Select
                        value={questionType}
                        onChange={handleQuestionTypeChange}
                        size="small"
                        sx={{ marginLeft: "10px" }}
                    >
                        <MenuItem value="unreplied" disabled={questionOwner === "myquestion"}>
                            Unreplied
                        </MenuItem>
                        <MenuItem value="replied">Replied</MenuItem>
                    </Select>
                    <div
                        style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <label>Search</label>
                        <input type="text" className={styles.searchInput} style={{ flex: 1 }} placeholder="id / name" />
                    </div>
                    <QuestionDataGrid
                        type={questionType}
                        doctorId={questionOwner === "myquestion" ? userData.doctorId : undefined}
                        className={styles.datagrid}
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                    />
                </div>
            </div>
        </>
    );
}

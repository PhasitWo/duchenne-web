import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "../../styles/common.module.css";
import { Translate } from "../../hooks/LanguageContext";
import Header from "../../components/header";
import { CiCircleQuestion } from "react-icons/ci";
import QuestionDataGrid from "../../components/questionDataGrid";

type QuestionOwner = "myquestion" | "allquestion";
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

export default function Questions() {
    const [questionOwner, setQuestionOwner] = useState<QuestionOwner>("allquestion");
    const [questionType, setQuestionType] = useState<QuestionType>("unreplied");

    const handleQuestionOwnerChange = (e: SelectChangeEvent) => {
        if ((e.target.value as QuestionOwner) === "myquestion") {
            setQuestionType("replied");
        } else {
            setQuestionType("unreplied");
        }
        setQuestionOwner(e.target.value as QuestionOwner);
    };
    const handleQuestionTypeChange = (e: SelectChangeEvent) => {
        setQuestionType(e.target.value as QuestionType);
    };
    return (
        <>
            <Header>
                <CiCircleQuestion />
                <Translate token="Questions" />
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <Select value={questionOwner} onChange={handleQuestionOwnerChange} size="small">
                        <MenuItem value="allquestion">All Questions</MenuItem>
                        <MenuItem value="myquestion">My Questions</MenuItem>
                    </Select>
                    <Select value={questionType} onChange={handleQuestionTypeChange} size="small" sx={{ marginLeft: "10px" }}>
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
                        <label>
                            <Translate token="Search" />
                        </label>
                        <input type="text" className={styles.searchInput} style={{ flex: 1 }} placeholder="id / name" />
                    </div>
                    <QuestionDataGrid
                        rows={mockup}
                        className={styles.datagrid}
                        sortModel={[
                            {
                                field: questionType === "unreplied" ? "createAt" : "answerAt",
                                sort: questionType === "unreplied" ? "asc" : "desc",
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}

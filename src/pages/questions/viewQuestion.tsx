import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/header";
import { useState } from "react";
import dayjs from "dayjs";
import styles from "../../styles/common.module.css";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

interface Data {
    patient: { id: number; name: string };
    topic: string;
    question: string;
    createAt: number;
    answer?: string;
    answerAt?: number;
    doctor?: { id: number; name: string };
}

const mockupData: Data[] = [
    {
        patient: { id: 1, name: "Mr.Bean Bindai" },
        topic: "Example! this is a question",
        question: "What is love, baby don't hurt me. asdjk;k;as k;Lipqwe;jas;d ;akseo[hhjksdgajhgdqwieyiuy sssasdasd asdasdsa",
        createAt: 1734268740,
        answerAt: 1734368740,
        answer: "love is .... baby don't hurt me. asdjk;k;as k;Lipqwe;jas;d ;akseo[hhjksdgajhgdqwieyiuy",
        doctor: {
            id: 1,
            name: "Dr.Earth",
        },
    },
    {
        patient: { id: 1, name: "Mr.Bean Bindai" },
        topic: "Example! this is a question",
        question: "What is love, baby don't hurt me. asdjk;k;as k;Lipqwe;jas;d ;akseo[hhjksdgajhgdqwieyiuy sssasdasd asdasdsa",
        createAt: 1734268740,
    },
    {
        patient: { id: 1, name: "Mr.Bean Bindai" },
        topic: "Example! this is a question",
        question: "What is love, baby don't hurt me. asdjk;k;as k;Lipqwe;jas;d ;akseo[hhjksdgajhgdqwieyiuy sssasdasd asdasdsa",
        createAt: 1734268740,
    },
];

export default function ViewQuestion() {
    const { id } = useParams();
    const [data] = useState<Data>(mockupData[Number(id) - 1]);

    return (
        <>
            <Header>This is view question/{id}</Header>
            <div id="content-body">
                <div className={styles.questionBox}>
                    <div className={styles.topicContainer}>
                        <h2 style={{ margin: 0 }}>{data.topic}</h2>
                        <div style={{ color: "grey" }}>
                            <NavLink to={`/patient/${data.patient.id}`}>{data.patient.name}</NavLink>
                            <span>Asked {dayjs(data.createAt * 1000).format("DD/MM/YY HH:mm")}</span>
                        </div>
                    </div>
                    <div className={styles.questionContainer}>
                        <p>{data.question}</p>
                    </div>
                </div>
                <div className={styles.answerBox}>
                    <div className={styles.answerHeaderContainer}>
                        <h2 style={{ margin: 0 }}>{data.answerAt ? "Reply" : "Add a Reply"}</h2>
                        {data.answerAt && (
                            <div style={{ color: "grey" }}>
                                <NavLink to={`/doctor/${data.doctor?.id}`}>{data.doctor?.name}</NavLink>
                                <span>Replied {dayjs(data.createAt * 1000).format("DD/MM/YY HH:mm")}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.answerContainer}>
                        {data.answerAt ? (
                            <>
                                <p>{data.answer}</p>
                            </>
                        ) : (
                            <>
                                <TextareaAutosize
                                    style={{ width: "100%", resize: "vertical", fontFamily: "Noto Sans Thai", fontSize: "1rem" }}
                                    minRows={6}
                                ></TextareaAutosize>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className={styles.button}>Reply</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

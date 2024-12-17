import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/header";
import { useState } from "react";
import dayjs from "dayjs";
import styles from "../../styles/common.module.css";

interface Data {
    patient: { id: number; name: string };
    topic: string;
    question: string;
    createAt: number;
    answer?: string;
    answerAt?: string;
    doctor?: string;
}

export default function ViewQuestion() {
    const { id } = useParams();
    const [data] = useState<Data>(mockupData);
    return (
        <>
            <Header>This is view question/{id}</Header>
            <div id="content-body">
                <div className={styles.topicContainer}>
                    <h2 style={{ margin: 0 }}>{data.topic}</h2>
                    <div style={{ color: "grey" }}>
                        <NavLink to={`/patient/${data.patient.id}`}>{data.patient.name}</NavLink>
                        <span>Asked {dayjs(data.createAt * 1000).format("DD/MM/YY HH:mm")}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

const mockupData: Data = {
    patient: { id: 1, name: "Mr.Bean Bindai" },
    topic: "Example! this is a question",
    question:
        "What is love, baby don't hurt me. asdjk;k;as k;Lioeqwi aks;dlkasl;koipqwe;jas;d ;aksl;dqw0opeo[hhjksdgajhgdqwieyiuy",
    createAt: 1734268740,
};

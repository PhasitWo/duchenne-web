import { NavLink, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "../../styles/common.module.css";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import GoBack from "../../components/goback";
import { Question } from "../../model/model";
import { toast } from "react-toastify";
import Loading from "../loading";
import { useQuestionStore } from "../../stores/question";

export default function ViewQuestion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Question | null>(null);
    const [reply, setReply] = useState("");
    const { getQuestion, answerQuestion } = useQuestionStore();

    useEffect(() => {
        fetch();
    }, [id]);

    const fetch = async () => {
        if (!id) return;
        setIsLoading(true);
        const res = await getQuestion(id);
        setIsLoading(false);
        if (res) setData(res);
        else if (res === null) navigate("/notFound");
    };

    const handleReply = async () => {
        if (!id) return;
        const trimmedReply = reply.trim();
        if (trimmedReply === "") {
            toast.error("Your reply cannot be empty");
            return;
        }
        if (trimmedReply.length > 500) {
            toast.error("Your answer cannot exceed 500 characters");
            return;
        }

        setIsLoading(true);
        const succeed = await answerQuestion(id, reply);
        setIsLoading(false);
        if (succeed) navigate("/reload");
    };

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>This is view question/{id}</Header>
            <div id="content-body">
                <GoBack />
                <div className={styles.questionBox}>
                    <div className={styles.topicContainer}>
                        <h2 style={{ margin: 0 }}>{data?.topic}</h2>
                        <div style={{ color: "grey" }}>
                            <NavLink to={`/patient/${data?.patient.id}`}>{`${data?.patient.firstName} ${
                                data?.patient.middleName ?? ""
                            } ${data?.patient.lastName}`}</NavLink>
                            <span>Asked {dayjs((data?.createAt ?? 0) * 1000).format("DD/MM/YY HH:mm")}</span>
                        </div>
                    </div>
                    <div className={styles.questionContainer}>
                        <p>{data?.question}</p>
                    </div>
                </div>
                <div className={styles.answerBox}>
                    <div className={styles.answerHeaderContainer}>
                        <h2 style={{ margin: 0 }}>{data?.answerAt ? "Reply" : "Add a Reply"}</h2>
                        {data?.answerAt && (
                            <div style={{ color: "grey" }}>
                                {data.doctor?.id !== 0 ? (
                                    <NavLink to={`/doctor/${data.doctor?.id}`}>{`${
                                        data?.doctor?.firstName ?? "Unknown"
                                    } ${data?.doctor?.middleName ?? ""} ${data?.doctor?.lastName}`}</NavLink>
                                ) : (
                                    <span>{"Unknown "}</span>
                                )}

                                <span>Replied {dayjs(data.createAt * 1000).format("DD/MM/YY HH:mm")}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.answerContainer}>
                        {data?.answerAt ? (
                            <>
                                <p>{data.answer}</p>
                            </>
                        ) : (
                            <>
                                <TextareaAutosize
                                    style={{
                                        width: "100%",
                                        resize: "vertical",
                                        fontFamily: "Noto Sans Thai",
                                        fontSize: "1rem",
                                    }}
                                    minRows={6}
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                ></TextareaAutosize>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className={styles.button} onClick={handleReply}>
                                        Reply
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

import { create } from "zustand";
import { Question, QuestionTopic } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    listQuestions: (params: ListQuestionsParams) => Promise<ListQuestionsResponse>;
    getQuestion: (id: number | string) => Promise<Question | null | undefined>;
    answerQuestion: (id: number | string, answer: string) => Promise<boolean>;
};

type ListQuestionsParams = {
    limit: number;
    offset: number;
    type: string;
    doctorId?: number;
    patientId?: number;
};

type ListQuestionsResponse = {
    data: QuestionTopic[];
    hasNextPage: boolean;
};

export const useQuestionStore = create<Action>(() => ({
    listQuestions: async (params) => {
        let result: ListQuestionsResponse = { data: [], hasNextPage: false };
        try {
            let res = await api.get<QuestionTopic[]>(
                attachQueryParams(
                    "/api/question",
                    params.limit + 1,
                    params.offset,
                    params.type,
                    params.doctorId,
                    params.patientId
                )
            );
            switch (res.status) {
                case 200:
                    if (res.data.length == params.limit + 1) {
                        res.data.pop();
                        result.hasNextPage = true;
                    } else {
                        result.hasNextPage = false;
                    }
                    result.data = res.data;
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    getQuestion: async (id) => {
        try {
            let res = await api.get<Question>("/api/question/" + id);
            switch (res.status) {
                case 200:
                    return res.data;
                case 404:
                    return null;
            }
        } catch (err) {
            handleError(err);
        }
    },
    answerQuestion: async (id, answer) => {
        let result = false;
        try {
            const res = await api.put("/api/question/" + id + "/answer", { answer: answer });
            switch (res.status) {
                case 200:
                    toast.success("Submitted!");
                    result = true;
                    break;
                case 404:
                    toast.error("This question is not in the database");
                    break;
                case 409:
                    toast.error("This question has been replied");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
}));

// helper
const attachQueryParams = (
    url: string,
    limit: number,
    offset: number,
    type: string,
    doctorId?: number,
    patientId?: number
) => {
    url +=
        `?type=${type}` +
        (doctorId ? `&doctorId=${doctorId}` : "") +
        (patientId ? `&patientId=${patientId}` : "") +
        `&limit=${limit}` +
        `&offset=${offset}`;
    return url;
};

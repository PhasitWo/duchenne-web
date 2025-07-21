import { create } from "zustand";
import { Content } from "../model/model";
import api, { handleError } from "../services/api";

type Action = {
    listContents: (limit: number, offset: number) => Promise<ListContentsResponse>;
};

type ListContentsResponse = {
    data: Content[];
    hasNextPage: boolean;
};

export const useContentStore = create<Action>(() => ({
    listContents: async (limit, offset) => {
        let result: ListContentsResponse = { data: [], hasNextPage: false };
        try {
            let res = await api.get<Content[]>(attachQueryParams("/api/content", limit + 1, offset));
            switch (res.status) {
                case 200:
                    if (res.data.length == limit + 1) {
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
}));

// helper
const attachQueryParams = (url: string, limit: number, offset: number) => {
    url += `?limit=${limit}` + `&offset=${offset}`;
    return url;
};

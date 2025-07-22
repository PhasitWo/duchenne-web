import { create } from "zustand";
import { Content } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    createContent: (data: Content) => Promise<number | undefined>;
    listContents: (limit: number, offset: number) => Promise<ListContentsResponse>;
    getContent: (id: number | string) => Promise<Content | null | undefined>;
    updateContent: (id: number | string, data: Content) => Promise<boolean>;
    deleteContent: (id: number | string) => Promise<boolean>;
    uploadImage: (file: File) => Promise<string | undefined>;
};

type ListContentsResponse = {
    data: Content[];
    hasNextPage: boolean;
};

export const useContentStore = create<Action>(() => ({
    createContent: async (data) => {
        try {
            const res = await api.post("/api/content", data);
            switch (res.status) {
                case 201:
                    toast.success("New content created!");
                    return res.data.id;
                case 403:
                    toast.error("Insufficient permission");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
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
    getContent: async (id) => {
        try {
            let res = await api.get<Content>("/api/content/" + id);
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
    updateContent: async (id, data) => {
        let result = false;
        try {
            const res = await api.put("/api/content/" + id, data);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    result = true;
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This content is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate username");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    deleteContent: async (id) => {
        let result = false;
        try {
            const res = await api.delete("/api/content/" + id);
            switch (res.status) {
                case 204:
                    toast.success("Deleted!");
                    result = true;
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    uploadImage: async (file) => {
        const form = new FormData();
        form.append("image", file);
        let toastId = toast.loading("Uploading image...");
        try {
            const res = await api.post<{ publicURL: string }>("/api/image/upload", form);
            switch (res.status) {
                case 201:
                    toast.success("Image uploaded!");
                    return res.data.publicURL;
            }
        } catch (err) {
            toast.error("Fail to upload an image!");
            handleError(err);
        } finally {
            toast.done(toastId);
        }
    },
}));

// helper
const attachQueryParams = (url: string, limit: number, offset: number) => {
    url += `?limit=${limit}` + `&offset=${offset}`;
    return url;
};

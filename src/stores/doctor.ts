import { create } from "zustand";
import { Doctor, TrimDoctor } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    getProfile: () => Promise<Doctor | undefined>;
    updateProfile: (doctorInfo: Doctor) => Promise<boolean | undefined>;
    createDoctor: (data: Doctor) => Promise<number | undefined>;
    listDoctors: () => Promise<TrimDoctor[]>;
    getDoctor: (id: string | number) => Promise<Doctor | null | undefined>;
    updateDoctor: (id: string | number, data: Doctor) => Promise<boolean>;
    deleteDoctor: (id: string | number) => Promise<boolean>;
};

export const useDoctorStore = create<Action>(() => ({
    getProfile: async () => {
        try {
            let res = await api.get<Doctor>("/api/profile");
            switch (res.status) {
                case 200:
                    return res.data;
            }
        } catch (err) {
            handleError(err);
        }
    },
    updateProfile: async (doctorInfo) => {
        try {
            const res = await api.put("/api/profile", doctorInfo);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    return true;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This doctor is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate username");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
    createDoctor: async (data) => {
        try {
            const res = await api.post<{ id: number }>("/api/doctor", data);
            switch (res.status) {
                case 201:
                    toast.success("New doctor account created!");
                    return res.data.id;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 409:
                    toast.error("Duplicate username");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
    listDoctors: async () => {
        let result: TrimDoctor[] = [];
        try {
            let res = await api.get<TrimDoctor[]>("/api/doctor");
            switch (res.status) {
                case 200:
                    result = res.data;
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    getDoctor: async (id) => {
        try {
            let res = await api.get<Doctor>("/api/doctor/" + id);
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
    updateDoctor: async (id, data) => {
        let result = false;
        try {
            const res = await api.put("/api/doctor/" + id, data);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    result = true;
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This doctor is not in the database");
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
    deleteDoctor: async (id) => {
        let result = false;
        try {
            const res = await api.delete("/api/doctor/" + id);
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
}));

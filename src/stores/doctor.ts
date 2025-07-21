import { create } from "zustand";
import { Doctor, TrimDoctor } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    getProfile: () => Promise<Doctor | undefined>;
    updateProfile: (doctorInfo: Doctor) => Promise<boolean | undefined>;
    listDoctors: () => Promise<TrimDoctor[]>;
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
}));

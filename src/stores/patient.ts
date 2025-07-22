import { create } from "zustand";
import { Patient, VaccineHistory } from "../model/model";
import api, { handleError } from "../services/api";
import { ExtendedMedicine } from "../components/medicineDataGrid";
import { toast } from "react-toastify";

type Action = {
    createPatient: (data: Patient) => Promise<number | undefined>;
    listPatients: () => Promise<Patient[]>;
    getPatient: (id: string | number) => Promise<Patient | null | undefined>;
    updatePatientGeneralInfo: (id: string | number, data: Patient) => Promise<boolean>;
    updatePatientMedicine: (patientId: string | number, data: ExtendedMedicine[]) => Promise<boolean>;
    updatePateintVaccineHistory: (patientId: string | number, data: VaccineHistory[]) => Promise<boolean>;
    deletePatient: (id: string | number) => Promise<boolean>;
};

export const usePatientStore = create<Action>(() => ({
    createPatient: async (data) => {
        try {
            const res = await api.post<{ id: number }>("/api/patient", data);
            switch (res.status) {
                case 201:
                    toast.success("Created new patient account!");
                    return res.data.id;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 409:
                    toast.error("Duplicate HN");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
    listPatients: async () => {
        let result: Patient[] = [];
        try {
            let res = await api.get<Patient[]>("/api/patient");
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
    getPatient: async (id) => {
        try {
            let res = await api.get<Patient>("/api/patient/" + id);
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
    updatePatientGeneralInfo: async (id, data) => {
        let result = false;
        try {
            const res = await api.put("/api/patient/" + id, data);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    result = true;
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate HN");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    updatePatientMedicine: async (patientId, data) => {
        let result = false;
        try {
            const res = await api.put(`/api/patient/${patientId}/medicine`, { data: data });
            switch (res.status) {
                case 200:
                    toast.success("Patient's medicine list is updated!");
                    result = true;
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    updatePateintVaccineHistory: async (patientId, data) => {
        let result = false;
        try {
            const res = await api.put(`/api/patient/${patientId}/vaccineHistory`, {
                data: data,
            });
            switch (res.status) {
                case 200:
                    toast.success("Patient's vaccine history is updated!");
                    result = true;
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    deletePatient: async (id) => {
        let result = false;
        try {
            const res = await api.delete("/api/patient/" + id);
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

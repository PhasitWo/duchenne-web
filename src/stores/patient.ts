import { create } from "zustand";
import { Patient, VaccineHistory } from "../model/model";
import api, { handleError } from "../services/api";
import { ExtendedMedicine } from "../components/medicineDataGrid";
import { toast } from "react-toastify";

type Action = {
    listPatients: () => Promise<Patient[]>;
    updatePatientMedicine: (patientId: number, data: ExtendedMedicine[]) => Promise<boolean>;
    updatePateintVaccineHistory: (patientId: number, data: VaccineHistory[]) => Promise<boolean>;
};

export const usePatientStore = create<Action>(() => ({
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
        let result = false
        try {
            const res = await api.put(`/api/patient/${patientId}/vaccineHistory`, {
                data: data,
            });
            switch (res.status) {
                case 200:
                    toast.success("Patient's vaccine history is updated!");
                    result = true
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result
        }
    },
}));

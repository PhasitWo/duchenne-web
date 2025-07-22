import { create } from "zustand";
import { Appointment } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    createAppointment: (params: Omit<AppointmentParams, "appointmentId">) => Promise<number | undefined>;
    listAppointments: (params: ListAppointmentsParams) => Promise<ListAppointmentsResponse>;
    updateAppointment: (params: AppointmentParams) => Promise<boolean>;
    deleteAppointment: (id: number) => Promise<boolean>;
};

type ListAppointmentsParams = {
    limit: number;
    offset: number;
    type: string;
    doctorId?: number;
    patientId?: number;
};

type ListAppointmentsResponse = {
    data: Appointment[];
    hasNextPage: boolean;
};

type AppointmentParams = {
    appointmentId: number;
    doctorId: number;
    patientId: number;
    dateUnix: number;
    approve: boolean;
};

export const useAppointmentStore = create<Action>(() => ({
    createAppointment: async (params) => {
        try {
            let res = await api.post<{ id: number }>("/api/appointment", {
                doctorId: params.doctorId,
                patientId: params.patientId,
                date: params.dateUnix,
                approve: params.approve,
            });
            switch (res.status) {
                case 201:
                    toast.success("New Appointment Created!");
                    return res.data.id;
                case 422:
                    toast.error("Invalid Date");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
    listAppointments: async (params) => {
        let result: ListAppointmentsResponse = { data: [], hasNextPage: false };
        try {
            let res = await api.get<Appointment[]>(
                attachQueryParams(
                    "/api/appointment",
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
    updateAppointment: async (params) => {
        let result = false;
        try {
            let res = await api.put<{ id: number }>(`/api/appointment/${params.appointmentId}`, {
                doctorId: params.doctorId,
                patientId: params.patientId,
                date: params.dateUnix,
                approve: params.approve,
            });
            switch (res.status) {
                case 200:
                    result = true;
                    toast.success("Appointment is updated!");
                    break;
                case 422:
                    toast.error("Invalid Date");
                    break;
            }
        } catch (err) {
            handleError(err);
        } finally {
            return result;
        }
    },
    deleteAppointment: async (id) => {
        let result = false;
        try {
            let res = await api.delete<{ id: number }>(`/api/appointment/${id}`);
            switch (res.status) {
                case 204:
                    result = true;
                    toast.success("Appointment is deleted!");
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

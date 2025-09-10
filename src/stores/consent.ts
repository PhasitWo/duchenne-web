import { create } from "zustand";
import { Consent } from "../model/model";
import api, { handleError } from "../services/api";
import { toast } from "react-toastify";

type Action = {
    upsertConsent: (data: Consent) => Promise<string | undefined>;
    getConsentBySlug: (id: number | string) => Promise<Consent | null | undefined>;
};

export const useConsentStore = create<Action>(() => ({
    upsertConsent: async (data) => {
        try {
            const res = await api.put<{ slug: string }>("/api/consent", data);
            switch (res.status) {
                case 200:
                    toast.success("Upserted!");
                    return res.data.slug;
                case 403:
                    toast.error("Insufficient permission");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },

    getConsentBySlug: async (slug) => {
        try {
            let res = await api.get<Consent>("/api/consent/slug/" + slug);
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
}));

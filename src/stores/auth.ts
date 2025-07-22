import { create } from "zustand";
import { Permission, rolePermissionMap } from "../constants/permission";
import api, { handleError } from "../services/api";
import { AxiosError } from "axios";
import { ErrResponse } from "../model/model";
import { toast } from "react-toastify";
import { type NavigateFunction } from "react-router-dom";

type State = {
    authState: AuthState;
    userData: UserData;
};

type Action = {
    login: (username: string, password: string, navigateFunc: NavigateFunction) => Promise<void>;
    logout: (navigateFunc: NavigateFunction) => Promise<void>;
    loginDispatch: (navigateFunc: NavigateFunction, skipNavigate?: boolean) => void;
    logoutDispatch: (navigateFunc: NavigateFunction) => void;
    fetchUserData: () => Promise<boolean | undefined>;
    checkPermission: (requiredPermission: Permission) => boolean;
};

interface AuthState {
    isLoading: boolean;
    isSignin: boolean;
}
interface UserData {
    doctorId: number;
    role: string;
}

export const useAuthStore = create<State & Action>((set, get) => ({
    // states
    authState: {
        isLoading: true,
        isSignin: false,
    },
    userData: { doctorId: -1, role: "user" },
    // actions
    checkPermission: (requiredPermission) => {
        let hasPermission = false;
        for (let permission of rolePermissionMap[get().userData.role]) {
            if (permission === requiredPermission) return true;
        }
        return hasPermission;
    },
    fetchUserData: async () => {
        let result = undefined;
        try {
            const response = await api.get<UserData>("/api/userData");
            switch (response.status) {
                case 200:
                    result = true;
                    set(() => ({ userData: response.data }));
                    break;
                case 401:
                    result = false;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            return result;
        }
    },
    login: async (username, password, navigateFunc) => {
        try {
            const response = await api.post("/auth/login", {
                username: username,
                password: password,
            });
            switch (response.status) {
                case 200:
                    get().loginDispatch(navigateFunc);
                    get().fetchUserData();
                    toast.success("Login successfully");
                    break;
                case 401:
                    toast.error("Invalid credential");
                    break;
                case 404:
                    toast.error("No account with following credentials");
                    break;
            }
        } catch (err) {
            handleError(err);
        }
    },
    logout: async (navigateFunc) => {
        const response = await api.post("/auth/logout");
        if (response.status !== 200) {
            toast.error("Cannot logout");
        } else {
            get().logoutDispatch(navigateFunc);
        }
    },
    loginDispatch: (navigateFunc, skipNavigate = false) => {
        set(() => ({ authState: { isLoading: false, isSignin: true } }));
        if (!skipNavigate) navigateFunc("/", { replace: true });
    },
    logoutDispatch: (navigateFunc) => {
        set(() => ({ authState: { isLoading: false, isSignin: false } }));
        navigateFunc("/login", { replace: true });
    },
}));

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { ErrResponse } from "../model/model";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { AxiosInstance } from "axios";

export enum Permission {
    createDoctorPermission,
    updateDoctorPermission,
    deleteDoctorPermission,
    createPatientPermission,
    updatePatientPermission,
    deletePatientPermission,
}

const adminPermissions = [
    Permission.createPatientPermission,
    Permission.updatePatientPermission,
    Permission.deletePatientPermission,
];
const rootPermissions = [
    ...adminPermissions,
    Permission.createDoctorPermission,
    Permission.updateDoctorPermission,
    Permission.deleteDoctorPermission,
];

const rolePermissionMap: { [key: string]: Permission[] } = {
    user: [],
    admin: adminPermissions,
    root: rootPermissions,
};

interface AuthState {
    isLoading: boolean;
    isSignin: boolean;
}
interface UserData {
    doctorId: number;
    role: string;
}

var apiUrl =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_DEV_API_URL
        : import.meta.env.VITE_PROD_API_URL; // FIXME CHANGE TO VITE_PROD_API_URL

const AuthApiContext = createContext<{
    authState: AuthState;
    userData: UserData;
    loginDispatch: () => void;
    logoutDispatch: () => void;
    fetchUserData: () => Promise<boolean>;
    checkPermission: (requiredPermission: Permission) => boolean;
    api: AxiosInstance;
}>({
    authState: { isLoading: true, isSignin: false },
    userData: { doctorId: -1, role: "none" },
    loginDispatch: () => {},
    logoutDispatch: () => {},
    fetchUserData: async () => false,
    api: axios.create(),
    checkPermission: () => false,
});

export function useAuthApiContext() {
    const val = useContext(AuthApiContext);
    return val;
}
export function AuthApiProvider({ children }: PropsWithChildren) {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isSignin: false,
    });
    const [userData, setUserData] = useState<UserData>({ doctorId: -1, role: "user" });
    const navigate = useNavigate();

    // check auth state on mount
    useEffect(() => {
        console.log("checking auth state");
        checkAuthState();
    }, []);
    const checkAuthState = async () => {
        const succeed = await fetchUserData();
        if (succeed) loginDispatch();
    };

    const loginDispatch = () => {
        setAuthState({ isLoading: false, isSignin: true });
        navigate("/", { replace: true });
    };
    const logoutDispatch = () => {
        setAuthState({ isLoading: false, isSignin: false });
        navigate("/login", { replace: true });
    };
    const api = useMemo<AxiosInstance>(() => {
        console.log("URL ->", apiUrl);
        const instance = axios.create({
            baseURL: apiUrl,
            timeout: 5000,
            withCredentials: true,
            validateStatus: (status: number) => status < 500 && status != 400,
        });
        instance.interceptors.response.use((res) => {
            // navigate to login page everytime the response status is 401
            if (res.status === 401) {
                if (res.config.url !== "/api/userData") toast.error("Invalid access token");
                logoutDispatch();
            }
            return res;
        });
        return instance;
    }, []);
    const fetchUserData = async () => {
        let result = false;
        try {
            const response = await api.get<UserData>("/api/userData");
            switch (response.status) {
                case 200:
                    result = true;
                    setUserData(response.data);
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
                // retry
                setTimeout(() => {
                    console.log("retry fetching user data");
                    fetchUserData();
                }, 2000);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            return result;
        }
    };
    const checkPermission = (requiredPermission: Permission): boolean => {
        let hasPermission = false;
        for (let permission of rolePermissionMap[userData.role]) {
            if (permission === requiredPermission) return true;
        }
        return hasPermission;
    };
    return (
        <AuthApiContext.Provider
            value={{
                authState: authState,
                userData: userData,
                loginDispatch: loginDispatch,
                logoutDispatch: logoutDispatch,
                fetchUserData: fetchUserData,
                checkPermission: checkPermission,
                api: api,
            }}
        >
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </AuthApiContext.Provider>
    );
}

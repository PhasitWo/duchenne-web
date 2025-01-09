import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { ErrResponse } from "../model/model";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { AxiosInstance } from "axios";

interface AuthState {
    isLoading: boolean;
    isSignin: boolean;
}
interface UserData {
    doctorId: number;
    role: string;
}

type LoginDispatch = () => void;
type LogoutDispatch = () => void;

var apiUrl =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_DEV_API_URL
        : import.meta.env.VITE_DEV_API_URL; // FIXME CHANGE TO VITE_PROD_API_URL

const AuthApiContext = createContext<{
    authState: AuthState;
    userData: UserData;
    loginDispatch: LoginDispatch;
    logoutDispatch: LogoutDispatch;
    api: AxiosInstance;
}>({
    authState: { isLoading: true, isSignin: false },
    userData: { doctorId: -1, role: "none" },
    loginDispatch: () => {},
    logoutDispatch: () => {},
    api: axios.create(),
});

export function useAuthApiContext() {
    const val = useContext(AuthApiContext);
    return val;
}
export function AuthApiProvider({ children }: PropsWithChildren) {
    const [authState, setAuthState] = useState(initialState);
    const [userData, setUserData] = useState<UserData>({ doctorId: -1, role: "none" });

    const loginDispatch = () => {
        setAuthState({ isLoading: false, isSignin: true });
    };
    const logoutDispatch = () => {
        setAuthState({ isLoading: false, isSignin: false });
        navigate("/login", { replace: true });
    };
    // check auth state on mount
    useEffect(() => {
        console.log("checking auth state")
        checkAuthState();
    }, []);
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
    const navigate = useNavigate();
    const checkAuthState = async () => {
        try {
            const response = await api.get<UserData>("/api/userData");
            switch (response.status) {
                case 200:
                    setUserData(response.data);
                    loginDispatch();
                    navigate("/", { replace: true });
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        }
    };
    return (
        <AuthApiContext.Provider
            value={{
                authState: authState,
                userData: userData,
                loginDispatch: loginDispatch,
                logoutDispatch: logoutDispatch,
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

const initialState: AuthState = {
    isLoading: true,
    isSignin: false,
};

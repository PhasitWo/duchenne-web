import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useApiContext } from "./apiContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ErrResponse } from "../model/model";
import { toast } from "react-toastify";

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

const AuthContext = createContext<{
    authState: AuthState;
    userData: UserData;
    loginDispatch: LoginDispatch;
    logoutDispatch: LogoutDispatch;
}>({
    authState: { isLoading: true, isSignin: false },
    userData: { doctorId: -1, role: "none" },
    loginDispatch: () => {},
    logoutDispatch: () => {},
});

export function useAuthContext() {
    const val = useContext(AuthContext);
    return val;
}
export function AuthProvider({ children }: PropsWithChildren) {
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
        checkAuthState();
    }, []);

    const { api } = useApiContext();
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
                case 401:
                    logoutDispatch();
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
        <AuthContext.Provider
            value={{
                authState: authState,
                userData: userData,
                loginDispatch: loginDispatch,
                logoutDispatch: logoutDispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const initialState: AuthState = {
    isLoading: true,
    isSignin: false,
};

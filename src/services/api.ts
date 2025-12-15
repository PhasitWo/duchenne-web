import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrResponse } from "../model/model";
import Cookies from "js-cookie";
import { AuthCookie } from "../constants";

var apiUrl =
    import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_PROD_API_URL;

const instance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    withCredentials: false,
    validateStatus: (status: number) => status < 500 && status != 400,
});

instance.interceptors.request.use((config) => {
    const token = Cookies.get(AuthCookie.ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use((res) => {
    // trigger checkAuthState function by reloading page
    if (res.status === 401) {
        if (res.config.url !== "/api/userData" && res.config.url !== "/auth/login") {
            toast.error("Invalid access token");
            location.reload();
        }
    }
    return res;
});

export const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
        let error = err as AxiosError<ErrResponse>;
        toast.error(error.response?.data.error);
    } else toast.error(`Fatal Error: ${err}`);
};

export default instance;

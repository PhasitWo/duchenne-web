import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import type { AxiosInstance } from "axios";
import axios from "axios";

const ApiContext = createContext<{ api: AxiosInstance }>({
    api: axios.create(),
});

export function useApiContext() {
    const val = useContext(ApiContext);
    return val;
}

var apiUrl =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_DEV_API_URL
        : import.meta.env.VITE_DEV_API_URL; // FIXME CHANGE TO VITE_PROD_API_URL
export function ApiProvider({ children }: PropsWithChildren) {
    console.log("URL ->", apiUrl);
    const api = useMemo<AxiosInstance>(
        () =>
            axios.create({
                baseURL: apiUrl,
                timeout: 5000,
                withCredentials: true,
                validateStatus: (status: number) => status < 500 && status != 400,
            }),
        []
    );
    return <ApiContext.Provider value={{ api: api }}>{children}</ApiContext.Provider>;
}

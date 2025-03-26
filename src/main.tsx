import "./styles/main.css";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { AuthApiProvider } from "./hooks/authApiContext.tsx";
import { LanguageProvider } from "./hooks/languageContext.tsx";
import { HashRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { StrictMode } from "react";
createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <HashRouter>
        <AuthApiProvider>
            <LanguageProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App />
                </LocalizationProvider>
            </LanguageProvider>
        </AuthApiProvider>
    </HashRouter>
    // </StrictMode>
);

import "./styles/main.css";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { AuthApiProvider } from "./hooks/authApiContext.tsx";
import { LanguageProvider } from "./hooks/languageContext.tsx";
import { HashRouter } from "react-router-dom";
// import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <HashRouter>
        <AuthApiProvider>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </AuthApiProvider>
    </HashRouter>
    // </StrictMode>
);

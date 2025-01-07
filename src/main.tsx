import "./styles/main.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { AuthProvider } from "./hooks/authContext.tsx";
import { ApiProvider } from "./hooks/apiContext.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HashRouter>
            <ApiProvider>
                <AuthProvider>
                    <LanguageProvider>
                        <App />
                    </LanguageProvider>
                </AuthProvider>
            </ApiProvider>
        </HashRouter>
    </StrictMode>
);

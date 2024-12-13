import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Test from "./pages/test.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}>
                        <Route index element={<Test />} />
                        <Route path="doctors" element={<Test />} />
                        <Route path="patients" element={<Test />} />
                        <Route path="appointments" element={<Test />} />
                        <Route path="questions" element={<Test />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    </StrictMode>
);

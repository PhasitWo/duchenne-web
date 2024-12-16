import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout.tsx";
import Home from "./pages/home.tsx";
import Doctors from "./pages/doctors.tsx";
import Patients from "./pages/patients.tsx";
import Appointments from "./pages/appointments.tsx";
import Questions from "./pages/questions.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LanguageProvider>
            <HashRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="doctors" element={<Doctors />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="questions" element={<Questions />} />
                    </Route>
                </Routes>
            </HashRouter>
        </LanguageProvider>
    </StrictMode>
);

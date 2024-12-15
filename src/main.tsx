import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Test from "./pages/test.tsx";
import Doctors from "./pages/doctors.tsx";
import Patients from "./pages/patients.tsx";
import Appointments from "./pages/appointments.tsx";
import Questions from "./pages/questions.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Home />}>
                        <Route index element={<Test />}/>
                        <Route path="doctors" element={<Doctors />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="questions" element={<Questions />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    </StrictMode>
);

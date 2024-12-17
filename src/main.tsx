import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout.tsx";
import Home from "./pages/home.tsx";
import Doctors from "./pages/doctors/doctors.tsx";
import Patients from "./pages/patients/patients.tsx";
import Appointments from "./pages/appointments.tsx";
import Questions from "./pages/questions/questions.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";
import ViewDoctor from "./pages/doctors/viewDoctor.tsx";
import ViewPatient from "./pages/patients/viewPatient.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LanguageProvider>
            <HashRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="doctor">
                            <Route index element={<Doctors />} />
                            <Route path=":id" element={<ViewDoctor />} />
                        </Route>
                        <Route path="patient">
                            <Route index element={<Patients />} />
                            <Route path=":id" element={<ViewPatient/>}/>
                        </Route>
                        <Route path="appointment" element={<Appointments />} />
                        <Route path="question" element={<Questions />} />
                    </Route>
                </Routes>
            </HashRouter>
        </LanguageProvider>
    </StrictMode>
);

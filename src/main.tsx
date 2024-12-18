import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout.tsx";
import Home from "./pages/home.tsx";
import Profile from "./pages/profile.tsx";
import Doctors from "./pages/doctors/doctors.tsx";
import Patients from "./pages/patients/patients.tsx";
import Appointments from "./pages/appointments.tsx";
import Questions from "./pages/questions/questions.tsx";
import { LanguageProvider } from "./hooks/LanguageContext.tsx";
import ViewDoctor from "./pages/doctors/viewDoctor.tsx";
import ViewPatient from "./pages/patients/viewPatient.tsx";
import ViewQuestion from "./pages/questions/viewQuestion.tsx";
import Login from "./pages/login.tsx";
import AddDoctor from "./pages/doctors/addDoctor.tsx";
import AddPatient from "./pages/patients/addPatient.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LanguageProvider>
            <HashRouter>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="doctor">
                            <Route index element={<Doctors />} />
                            <Route path=":id" element={<ViewDoctor />} />
                            <Route path="new" element={<AddDoctor />} />
                        </Route>
                        <Route path="patient">
                            <Route index element={<Patients />} />
                            <Route path=":id" element={<ViewPatient />} />
                            <Route path="new" element={<AddPatient />} />
                        </Route>
                        <Route path="appointment" element={<Appointments />} />
                        <Route path="question">
                            <Route index element={<Questions />} />
                            <Route path=":id" element={<ViewQuestion />} />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </LanguageProvider>
    </StrictMode>
);

import "./styles/main.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout.tsx";
import Home from "./pages/home.tsx";
import Profile from "./pages/profile.tsx";
import Doctors from "./pages/doctors/doctors.tsx";
import Patients from "./pages/patients/patients.tsx";
import Appointments from "./pages/appointments.tsx";
import Questions from "./pages/questions/questions.tsx";
import ViewDoctor from "./pages/doctors/viewDoctor.tsx";
import ViewPatient from "./pages/patients/viewPatient.tsx";
import ViewQuestion from "./pages/questions/viewQuestion.tsx";
import Login from "./pages/login.tsx";
import AddDoctor from "./pages/doctors/addDoctor.tsx";
import AddPatient from "./pages/patients/addPatient.tsx";
import { Permission, useAuthApiContext } from "./hooks/authApiContext.tsx";
import { Navigate } from "react-router-dom";
import Loading from "./pages/loading.tsx";
import NotFound from "./pages/notFound.tsx";
import Reload from "./pages/reload.tsx";

export default function App() {
    const { authState, checkPermission } = useAuthApiContext();
    if (authState.isLoading) {
        return <Loading />;
    }
    return (
        <Routes>
            {authState.isSignin ? (
                <>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="doctor">
                            <Route index element={<Doctors />} />
                            <Route path=":id" element={<ViewDoctor />} />
                            <Route
                                path="new"
                                element={checkPermission(Permission.createDoctorPermission) ? <AddDoctor /> : <NotFound />}
                            />
                        </Route>
                        <Route path="patient">
                            <Route index element={<Patients />} />
                            <Route path=":id" element={<ViewPatient />} />
                            <Route
                                path="new"
                                element={checkPermission(Permission.createPatientPermission) ? <AddPatient /> : <NotFound />}
                            />
                        </Route>
                        <Route path="appointment" element={<Appointments />} />
                        <Route path="question">
                            <Route index element={<Questions />} />
                            <Route path=":id" element={<ViewQuestion />} />
                        </Route>
                        <Route path="notFound" element={<NotFound />} />
                    </Route>
                </>
            ) : (
                <>
                    <Route path="" index element={<Navigate to="/login" />} />
                    <Route path="login" element={<Login />} />
                </>
            )}
            <Route path="reload" element={<Reload />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

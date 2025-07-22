import "./styles/main.css";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import { Navigate } from "react-router-dom";
import Loading from "./pages/loading.tsx";
import NotFound from "./pages/notFound.tsx";
import Reload from "./pages/reload.tsx";
import Contents from "./pages/contents/contents.tsx";
import ViewContent from "./pages/contents/viewContent.tsx";
import { useAuthStore } from "./stores/auth.ts";
import { Permission } from "./constants/permission.ts";
import { useCallback, useEffect } from "react";

export default function App() {
    const { authState, checkPermission, fetchUserData, loginDispatch, logoutDispatch } = useAuthStore();
    const navigate = useNavigate();

    const checkAuthState = useCallback(async () => {
        console.log("checking auth state");
        const succeed = await fetchUserData();
        switch (succeed) {
            case undefined:
                // retry
                console.log("retry fetching user data...");
                setTimeout(() => checkAuthState(), 2000);
                break;
            case true:
                loginDispatch(navigate, true);
                break;
            case false:
                logoutDispatch(navigate);
                break;
        }
    }, []);

    // check auth state on mount
    useEffect(() => {
        checkAuthState();
    }, []);

    if (authState.isLoading) {
        return <Loading />;
    }
    return (
        <Routes>
            {authState.isSignin ? (
                <>
                    <Route element={<Layout />}>
                        <Route path="" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="content">
                            <Route index element={<Contents />} />
                            <Route path=":id" element={<ViewContent />} />
                            <Route path="new" element={<ViewContent createMode />} />
                        </Route>
                        <Route path="doctor">
                            <Route index element={<Doctors />} />
                            <Route path=":id" element={<ViewDoctor />} />
                            <Route
                                path="new"
                                element={
                                    checkPermission(Permission.createDoctorPermission) ? <AddDoctor /> : <NotFound />
                                }
                            />
                        </Route>
                        <Route path="patient">
                            <Route index element={<Patients />} />
                            <Route path=":id" element={<ViewPatient />} />
                            <Route
                                path="new"
                                element={
                                    checkPermission(Permission.createPatientPermission) ? <AddPatient /> : <NotFound />
                                }
                            />
                        </Route>
                        <Route path="appointment" element={<Appointments />} />
                        <Route path="question">
                            <Route index element={<Questions />} />
                            <Route path=":id" element={<ViewQuestion />} />
                        </Route>
                        <Route path="notFound" element={<NotFound />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </>
            ) : (
                <>
                    <Route path="*" index element={<Navigate to="/login" />} />
                    <Route path="login" element={<Login />} />
                </>
            )}
            <Route path="reload" element={<Reload />} />
        </Routes>
    );
}

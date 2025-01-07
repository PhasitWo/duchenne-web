import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonLinesFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiCircleQuestion } from "react-icons/ci";
import { Translate } from "../hooks/LanguageContext";
import logo from "../assets/Branding_logo.png";
import { BsPersonCircle } from "react-icons/bs";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApiContext } from "../hooks/apiContext";
import { useAuthContext } from "../hooks/authContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { api } = useApiContext();
    const { logoutDispatch } = useAuthContext();
    const testLogout = async () => {
        const response = await api.post("/auth/logout");
        if (response.status !== 200) {
            toast.error("Cannot logout");
        } else {
            logoutDispatch();
        }
    };
    return (
        <div id="navbar">
            <div id="top-navbar-box">
                <NavLink to="" id="logo-container">
                    <img src={logo} />
                </NavLink>
                <div id="profile-container">
                    <div id="profile-button" onClick={() => navigate("/profile")}>
                        <BsPersonCircle size={20} style={{ marginLeft: "5px" }} />
                        <div id="profile-name">Profile</div>
                        <RiExpandUpDownLine />
                    </div>
                </div>
            </div>
            <ul className="main-list">
                <li>
                    <NavLink to="doctor">
                        <FaUserDoctor />
                        <div>
                            <Translate token="Doctors" />
                        </div>
                    </NavLink>
                    <NavLink to="patient">
                        <BsPersonLinesFill />
                        <div>
                            <Translate token="Patients" />
                        </div>
                    </NavLink>
                    <NavLink to="appointment">
                        <AiOutlineSchedule />
                        <div>
                            <Translate token="Appointments" />
                        </div>
                    </NavLink>
                    <NavLink to="question">
                        <CiCircleQuestion />
                        <div>
                            <Translate token="Questions" />
                        </div>
                    </NavLink>
                    <a onClick={testLogout}>
                        <div></div>
                        <div>Logout</div>
                    </a>
                </li>
            </ul>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

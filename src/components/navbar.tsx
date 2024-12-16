import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonLinesFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiCircleQuestion } from "react-icons/ci";
import { Translate } from "../hooks/LanguageContext";
import logo from "../assets/Branding_logo.png";
import { BsPersonCircle } from "react-icons/bs";
import { RiExpandUpDownLine } from "react-icons/ri";

export default function Navbar() {

    return (
        <div id="navbar">
            <div id="top-navbar-box">
                <NavLink to="" id="logo-container">
                    <img src={logo} />
                </NavLink>
                <div id="profile-container">
                    <div id="profile-button">
                        <BsPersonCircle size={20} style={{ marginLeft: "5px" }} />
                        <div id="profile-name">พสิษฐ์ โวศรี าสวาสฟหกวสาวา</div>
                        <RiExpandUpDownLine />
                    </div>
                </div>
            </div>
            <ul className="main-list">
                <li>
                    <NavLink to="doctors">
                        <FaUserDoctor />
                        <div>
                            <Translate token="Doctors" />
                        </div>
                    </NavLink>
                    <NavLink to="patients">
                        <BsPersonLinesFill />
                        <div>
                            <Translate token="Patients" />
                        </div>
                    </NavLink>
                    <NavLink to="appointments">
                        <AiOutlineSchedule />
                        <div>
                            <Translate token="Appointments" />
                        </div>
                    </NavLink>
                    <NavLink to="questions">
                        <CiCircleQuestion />
                        <div>
                            <Translate token="Questions" />
                        </div>
                    </NavLink>
                </li>
            </ul>
            <p>
                TODO
                <br />
                /doctor/:id page
                <br />
                /patient/:id page
                <br />
                /question/:id page
                <br />
                /doctorProfile page :<br /> view info + change password
            </p>
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

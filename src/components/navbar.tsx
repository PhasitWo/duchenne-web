import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import "react-toastify/dist/ReactToastify.min.css";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonLinesFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiCircleQuestion } from "react-icons/ci";
import { FaBook } from "react-icons/fa6";
import logo from "../assets/Branding_logo.png";
import { BsPersonCircle } from "react-icons/bs";
import { RiExpandUpDownLine } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
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
                    <NavLink to="content">
                        <FaBook />
                        <div>Contents</div>
                    </NavLink>
                    <NavLink to="doctor">
                        <FaUserDoctor />
                        <div>Doctors</div>
                    </NavLink>
                    <NavLink to="patient">
                        <BsPersonLinesFill />
                        <div>Patients</div>
                    </NavLink>
                    <NavLink to="appointment">
                        <AiOutlineSchedule />
                        <div>Appointments</div>
                    </NavLink>
                    <NavLink to="question">
                        <CiCircleQuestion />
                        <div>Questions</div>
                    </NavLink>
                    <NavLink to="privacy-th" >
                        <MdOutlinePrivacyTip />
                        <div>Privacy TH</div>
                    </NavLink>
                    <NavLink to="privacy-en">
                        <MdOutlinePrivacyTip />
                        <div>Privacy EN</div>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

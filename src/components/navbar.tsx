import { NavLink } from "react-router-dom";
import "./navbar.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonLinesFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiCircleQuestion } from "react-icons/ci";
import { Translate } from "../hooks/LanguageContext";


export default function Navbar() {

    return (
        <div id="navbar">
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

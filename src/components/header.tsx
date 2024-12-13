import "./header.css";
import logo from "../assets/Branding_logo.png";
import { BsPersonCircle } from "react-icons/bs";
import { RiExpandUpDownLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation()
    return (
        <div id="header">
            <div id="top-navbar-box">
                <NavLink to="" id="logo-container">
                    <img src={logo} />
                </NavLink>
                <div id="profile-container">
                    <div id="profile-button">
                        <BsPersonCircle size={20} style={{ marginLeft: "5px" }} />
                        <div id="profile-name">John Chawlaiasdasdasdasdasd</div>
                        <RiExpandUpDownLine />
                    </div>
                </div>
            </div>
            <div id="header-title">
                <span>{location.pathname}</span>
            </div>
        </div>
    );
}

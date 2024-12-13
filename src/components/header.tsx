import "./header.css";
import logo from "../assets/Branding_logo.png";
import { BsPersonCircle } from "react-icons/bs";
import { RiExpandUpDownLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLanguage } from "../hooks/LanguageContext";

export default function Header() {
    const location = useLocation();
    const { currentLang, setCurrentLang } = useLanguage();
    const onChange = (_: any, target: string) => setCurrentLang(target);

    return (
        <div id="header">
            <div id="top-navbar-box">
                <NavLink to="" id="logo-container">
                    <img src={logo} />
                </NavLink>
                <div id="profile-container">
                    <div id="profile-button">
                        <BsPersonCircle size={20} style={{ marginLeft: "5px" }} />
                        <div id="profile-name">พสิษฐ์ โวศรี ฟกหกฟห ๆำ้่เ้หกดหกดฟหก</div>
                        <RiExpandUpDownLine />
                    </div>
                </div>
            </div>
            <div id="header-title-container">
                <span id="header-title">{location.pathname}</span>
                <ToggleButtonGroup onChange={onChange} id="toggle-button">
                    <ToggleButton value="en" selected={currentLang == "en"}>
                        EN
                    </ToggleButton>
                    <ToggleButton value="th" selected={currentLang == "th"}>
                        TH
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>
    );
}

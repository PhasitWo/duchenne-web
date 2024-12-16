import "../styles/header.css";
import {  useLocation } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Translate, useLanguage } from "../hooks/LanguageContext";

const titleMap: { [x: string]: string } = {
    "/doctors": "Doctors",
    "/patients": "Patients",
    "/appointments": "Appointments",
    "/questions": "Questions",
    "/": "Home"
};

export default function Header() {
    const location = useLocation();
    const { currentLang, setCurrentLang } = useLanguage();
    const onChange = (_: any, target: string) => setCurrentLang(target);
    console.log(location.pathname);
    return (
        <div id="header">
            <div id="header-title-container">
                <span id="header-title">
                    <Translate token={titleMap[location.pathname] ?? "NO TITLE"} />
                </span>
            </div>
            <ToggleButtonGroup onChange={onChange} id="toggle-button" style={{ marginRight: "50px" }}>
                <ToggleButton value="en" selected={currentLang == "en"}>
                    EN
                </ToggleButton>
                <ToggleButton value="th" selected={currentLang == "th"}>
                    TH
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

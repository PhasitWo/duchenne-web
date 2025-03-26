import "../styles/header.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useLanguage } from "../hooks/LanguageContext";
import type { PropsWithChildren } from "react";
import { useAuthApiContext } from "../hooks/authApiContext";

export default function Header({ children }: PropsWithChildren) {
    const { currentLang, setCurrentLang } = useLanguage();
    const { userData } = useAuthApiContext();
    const onChange = (_: any, target: string) => setCurrentLang(target);
    return (
        <div id="header">
            <div id="header-title-container">
                <div id="header-title">{children}</div>
            </div>
            <div>
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                    {userData.role} account
                </span>
                <ToggleButtonGroup
                    onChange={onChange}
                    id="toggle-button"
                    style={{ marginRight: "20px" }}
                    disabled
                >
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

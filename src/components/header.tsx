import "../styles/header.css";
import type { PropsWithChildren } from "react";
import OutlineButton from "./outlineButton";
import { useAuthStore } from "../stores/auth";
import { useNavigate } from "react-router-dom";

export default function Header({ children }: PropsWithChildren) {
    const navigate = useNavigate();
    const { userData, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout(navigate);
    };
    return (
        <div id="header">
            <div id="header-title-container">
                <div id="header-title">{children}</div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "25px",
                }}
            >
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>{userData.role} account</span>
                <OutlineButton onClick={handleLogout}>Logout</OutlineButton>
            </div>
        </div>
    );
}

// const { currentLang, setCurrentLang } = useLanguage();
// const onChange = (_: any, target: string) => setCurrentLang(target);
/*
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
*/

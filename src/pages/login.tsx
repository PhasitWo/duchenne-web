import "react-toastify/dist/ReactToastify.min.css";
import styles from "../styles/common.module.css";
import "../styles/login.css";
import { useState } from "react";
import { useAuthStore } from "../stores/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const login = useAuthStore((state) => state.login);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        login(username, password, navigate);
    };

    return (
        <>
            <div
                className="bg"
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            ></div>
            <div className="color" style={{ height: "100%", width: "100%", position: "fixed", top: 0 }}></div>
            <div className={styles.loginBox}>
                <form onSubmit={handleLogin}>
                    <h2 style={{ textAlign: "center" }}>Duchenne-Web</h2>
                    <label>Username</label>
                    <br />
                    <input
                        type="text"
                        className={styles.infoInput}
                        style={{ width: "100%" }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        className={styles.infoInput}
                        style={{ width: "100%" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button
                        className={styles.button}
                        style={{
                            marginTop: "15px",
                            width: "calc(100% + 13px)",
                            justifyContent: "center",
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </>
    );
}

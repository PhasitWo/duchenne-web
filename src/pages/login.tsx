import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styles from "../styles/common.module.css";
import "../styles/login.css";
import { AxiosError } from "axios";
import { ErrResponse } from "../model/model";
import { useState } from "react";
import { useAuthApiContext } from "../hooks/authApiContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { api, loginDispatch } = useAuthApiContext();
    const navigate = useNavigate();
    const [username, setUsername] = useState("testroot");
    const [password, setPassword] = useState("testroot");
    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", {
                username: username,
                password: password,
            });
            switch (response.status) {
                case 200:
                    loginDispatch();
                    navigate("/", {replace: true});
                    toast.success("Login successfully");
                    break;
                case 401:
                    toast.error("Invalid credential");
                    break;
                case 404:
                    toast.error("No account with following credentials");
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        }
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
            <div
                className="color"
                style={{ height: "100%", width: "100%", position: "fixed", top: 0 }}
            ></div>
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

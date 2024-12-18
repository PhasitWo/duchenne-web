import styles from "../styles/common.module.css";
import "../styles/login.css";

export default function Login() {
    return (
        <>
            <div className="bg" style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
            <div className="color" style={{ height: "100%", width:"100%", position:"fixed", top:0}}></div>
            <div className={styles.loginBox}>
                <h2 style={{ textAlign: "center" }}>Duchenne-Web</h2>
                <label>Username</label>
                <br />
                <input type="text" className={styles.infoInput} style={{ width: "100%" }} />
                <br />
                <label>Password</label>
                <br />
                <input type="password" className={styles.infoInput} style={{ width: "100%" }} />
                <br />
                <button
                    className={styles.button}
                    style={{ marginTop: "15px", width: "calc(100% + 13px)", justifyContent: "center" }}
                >
                    Login
                </button>
            </div>
        </>
    );
}

import "./styles/main.css";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { HashRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Bounce, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
// import { StrictMode } from "react";
createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <HashRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
        </LocalizationProvider>
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
    </HashRouter>
    // </StrictMode>
);

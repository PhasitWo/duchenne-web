import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

export default function Layout() {
    return (
        <>
            <div id="main-container">
                <Navbar />
                <div id="content">
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    );
}

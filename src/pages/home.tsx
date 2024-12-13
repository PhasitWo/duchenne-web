import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";

export default function Home() {
    return (
        <>
            <Header />
            <div id="main-container">
                <Navbar />
                <div id="content">
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    );
}

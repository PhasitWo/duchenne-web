import { FaArrowLeftLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export default function GoBack() {
    return (
        <div style={{ marginBottom: "10px", display:"inline-block"}}>
            <NavLink to=".." style={{ color: "grey", display:"flex", alignItems:"center" }}>
                <FaArrowLeftLong />
                <span style={{marginLeft: "5px"}}>Go back</span>
            </NavLink>
        </div>
    );
}

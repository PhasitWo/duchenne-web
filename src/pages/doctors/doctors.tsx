import styles from "../../styles/common.module.css";
import Header from "../../components/header";
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddButton from "../../components/addButton";
import { useAuthStore } from "../../stores/auth";
import { Permission } from "../../constants/permission";
import DoctorDataGrid from "../../components/datagrid/doctorDataGrid";
import { useDebounce } from "../../hooks/useDebounce";

export default function Doctors() {
    const navigate = useNavigate();
    const checkPermission = useAuthStore((state) => state.checkPermission);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 1000);

    return (
        <>
            <Header>
                <FaUserDoctor />
                Doctor
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>Search</label>
                        <input
                            type="text"
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                            placeholder="Name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <AddButton
                            style={{ marginLeft: "10px" }}
                            onClick={() => navigate("new")}
                            disabled={!checkPermission(Permission.createDoctorPermission)}
                        />
                    </div>
                    <DoctorDataGrid search={debouncedSearchText} />
                </div>
            </div>
        </>
    );
}

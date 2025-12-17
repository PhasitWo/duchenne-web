import styles from "../../styles/common.module.css";
import Header from "../../components/header";
import { BsPersonLinesFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddButton from "../../components/addButton";
import PatientDataGrid from "../../components/datagrid/patientDataGrid";

export default function Patients() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    return (
        <>
            <Header>
                <BsPersonLinesFill />
                Patients
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                        <label>Search</label>
                        <input
                            type="text"
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                            placeholder="HN / Name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <AddButton
                            style={{ marginLeft: "10px" }}
                            onClick={() => navigate("new")}
                            disabled={true} // deprecate
                        />
                    </div>
                    <PatientDataGrid localSearch={searchText} />
                </div>
            </div>
        </>
    );
}

import styles from "../../styles/common.module.css";
import Header from "../../components/header";
import { FaBook } from "react-icons/fa6";
import ContentDataGrid from "../../components/datagrid/contentDataGrid";
import AddButton from "../../components/addButton";
import { useNavigate } from "react-router-dom";

export default function Contents() {
    const navigate = useNavigate();
    return (
        <>
            <Header>
                <FaBook />
                Contents
            </Header>
            <div id="content-body">
                <div className={styles.datagridContainer}>
                    <div
                        style={{
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row-reverse",
                        }}
                    >
                        <AddButton style={{ marginLeft: "10px" }} onClick={() => navigate("new")} />
                    </div>
                    <ContentDataGrid />
                </div>
            </div>
        </>
    );
}

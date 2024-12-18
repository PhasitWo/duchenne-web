import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import GoBack from "../../components/goback";
import { Chip } from "@mui/material";
import { useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface Info {
    hn: number | string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
}

type Verify = 0 | 1

export default function AddPatient() {
    const [info, setInfo] = useState<Info>(initialInfo);
    const [verified, setVerified] = useState<Verify>(0);
    const handleVerifiedChange = (e: SelectChangeEvent) => {
        setVerified(Number(e.target.value) as Verify);
    };
    return (
        <>
            <Header>Add New Patient</Header>
            <div id="content-body">
                <GoBack />
                <div id="info-container" className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Patient Infomation</h3>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>HN</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.hn}
                            onChange={(e) => setInfo({ ...info, hn: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>First Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.firstName}
                            onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Middle Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.middleName}
                            onChange={(e) => setInfo({ ...info, middleName: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Last Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.lastName}
                            onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Email</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.email}
                            onChange={(e) => setInfo({ ...info, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Phone</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.phone}
                            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Status</label>
                        <div>
                            <Select size="small" value={String(verified)} onChange={handleVerifiedChange}>
                                <MenuItem value={0}>
                                    <Chip label="unverified" color="error" variant="outlined" />
                                </MenuItem>
                                <MenuItem value={1}>
                                    <Chip label="verified" color="success" variant="outlined" />
                                </MenuItem>
                            </Select>
                        </div>
                    </div>
                    {!verified && (
                        <span style={{ color: "grey" }}>
                            {" "}
                            *with 'unverified' status, this patient is needed to complete signup process in the mobile app
                        </span>
                    )}
                    <div className={styles.infoFooter}>
                        <button className={styles.button}>
                            <IoSaveOutline />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const initialInfo: Info = {
    hn: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
};

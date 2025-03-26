import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import GoBack from "../../components/goback";
import { Chip } from "@mui/material";
import { FormEvent, useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ErrResponse, Patient } from "../../model/model";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthApiContext } from "../../hooks/authApiContext";
import Loading from "../loading";
import { AxiosError } from "axios";

export default function AddPatient() {
    const { api } = useAuthApiContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<Patient>(initialInfo);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault()
        if (!formRef.current?.reportValidity()) return;
        if (info.hn.trim() === "" || info.firstName.trim() === "" || info.lastName.trim() === "") {
            toast.error("Not enough information");
            return;
        }
        if (info.hn.length > 15) {
            toast.error("HN cannot exceed 15 in length");
            return;
        }
        if (info.phone && info.phone.length > 15) {
            toast.error("Phone number cannot exceed 15 digits");
            return;
        }
        setIsLoading(true);
        try {
            const requestBody = {
                ...info,
                middleName: info.middleName === "" ? null : info.middleName,
                email: info.email === "" ? null : info.email,
                phone: info.middleName === "" ? null : info.middleName,
            };
            const res = await api.post<{ id: number }>("/api/patient", requestBody);
            switch (res.status) {
                case 201:
                    toast.success("Created new patient account!");
                    navigate("/patient/" + res.data.id);
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 409:
                    toast.error("Duplicate HN");
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>Add New Patient</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Patient Infomation</h3>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>HN*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.hn}
                            onChange={(e) => setInfo({ ...info, hn: e.target.value })}
                            maxLength={15}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>First Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.firstName}
                            onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Middle Name</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.middleName ?? ""}
                            onChange={(e) => setInfo({ ...info, middleName: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Last Name*</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.lastName}
                            onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Email</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.email ?? ""}
                            onChange={(e) => setInfo({ ...info, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Phone</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.phone ?? ""}
                            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                            maxLength={15}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Weight</label>
                        <input
                            type="number"
                            className={styles.infoInput}
                            value={info.weight ?? ""}
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    weight: isNaN(e.target.valueAsNumber)
                                        ? null
                                        : e.target.valueAsNumber,
                                })
                            }
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Height</label>
                        <input
                            type="number"
                            className={styles.infoInput}
                            value={info.height ?? ""}
                            onChange={(e) =>
                                setInfo({
                                    ...info,
                                    height: isNaN(e.target.valueAsNumber)
                                        ? null
                                        : e.target.valueAsNumber,
                                })
                            }
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Status*</label>
                        <div>
                            <Select
                                value={info.verified ? "verified" : "unverified"}
                                onChange={(e) =>
                                    setInfo({ ...info, verified: e.target.value === "verified" })
                                }
                                size="small"
                                sx={{ paddingLeft: 0 }}
                                required
                            >
                                <MenuItem value="verified">
                                    <Chip label="verified" color="success" variant="outlined" />
                                </MenuItem>
                                <MenuItem value="unverified">
                                    <Chip label="unverified" color="error" variant="outlined" />
                                </MenuItem>
                            </Select>
                        </div>
                    </div>
                    {!info.verified && (
                        <span style={{ color: "grey" }}>
                            *with 'unverified' status, this patient is needed to complete signup
                            process in the mobile app
                        </span>
                    )}
                    <div className={styles.infoFooter}>
                        <button className={styles.button} onClick={handleSave}>
                            <IoSaveOutline />
                            <span>Save</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

const initialInfo: Patient = {
    id: -1,
    hn: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    verified: true,
    medicine: null,
    vaccineHistory: null,
    height: null,
    weight: null,
};

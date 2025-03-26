import { FormEvent, useEffect, useRef, useState } from "react";
import commonStyles from "../../styles/common.module.css";
import { Modal, Box, Autocomplete, TextField, Checkbox } from "@mui/material";
import { useAuthApiContext } from "../../hooks/authApiContext";
import { ErrResponse, TrimDoctor, Patient } from "../../model/model";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { ImCross } from "react-icons/im";
import Loading from "../../pages/loading";

interface CreateAppointmentModalProps {
    open: boolean;
    setOpen: Function;
    onComplete: Function;
}

export default function CreateAppointmentModal(props: CreateAppointmentModalProps) {
    const { open, setOpen, onComplete } = props;
    const { api } = useAuthApiContext();
    const formRef = useRef<HTMLFormElement>(null);
    const [appointmentDate, setAppointmentDate] = useState(dayjs());
    const [approve, setApprove] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // onmount
    useEffect(() => {
        if (open) {
            fetchDoctors();
            fetchPatients();
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        // reset
        setApprove(false);
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setAppointmentDate(dayjs());
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        setIsLoading(true);
        try {
            let res = await api.post<{ id: number }>("/api/appointment", {
                doctorId: selectedDoctor!.id,
                patientId: selectedPatient!.id,
                date: appointmentDate.unix(),
                approve: approve,
            });
            switch (res.status) {
                case 201:
                    onComplete();
                    setOpen(false);
                    toast.success("New Appointment Created!");
                    break;
                case 422:
                    toast.error("Invalid Date");
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
                console.log(err);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    // doctor
    const [selectedDoctor, setSelectedDoctor] = useState<TrimDoctor | null>(null);
    const [doctorList, setDoctorList] = useState<TrimDoctor[]>([]);
    const [doctorLoading, setDoctorLoading] = useState(false);

    const fetchDoctors = async () => {
        setDoctorLoading(true);
        try {
            let res = await api.get<TrimDoctor[]>("/api/doctor");
            switch (res.status) {
                case 200:
                    setDoctorList(res.data);
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setDoctorLoading(false);
        }
    };

    // patient
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientList, setPatientList] = useState<Patient[]>([]);
    const [patientLoading, setPatientLoading] = useState(false);

    const fetchPatients = async () => {
        setPatientLoading(true);
        try {
            let res = await api.get<Patient[]>("/api/patient");
            switch (res.status) {
                case 200:
                    setPatientList(res.data);
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setPatientLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <h1 style={{ textAlign: "center" }}>Create Appointment</h1>
                        <form ref={formRef}>
                            <div style={style.inputContainer}>
                                <Autocomplete
                                    sx={{
                                        "& .MuiInputBase-root": { fontSize: "0.9rem" },
                                    }}
                                    disablePortal
                                    clearOnBlur
                                    value={selectedPatient}
                                    onChange={(_event: any, newValue) => {
                                        setSelectedPatient(newValue);
                                    }}
                                    options={patientList}
                                    getOptionLabel={(option) =>
                                        `${option.firstName} ${option.middleName ?? ""} ${
                                            option.lastName
                                        } (id:${option.id})`
                                    }
                                    loading={patientLoading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            sx={{ fontSize: "0.8rem" }}
                                            label="Patient"
                                            required
                                        />
                                    )}
                                />
                                <Autocomplete
                                    sx={{
                                        "& .MuiInputBase-root": { fontSize: "0.9rem" },
                                    }}
                                    disablePortal
                                    clearOnBlur
                                    value={selectedDoctor}
                                    onChange={(_event: any, newValue) => {
                                        setSelectedDoctor(newValue);
                                    }}
                                    options={doctorList}
                                    getOptionLabel={(option) =>
                                        `${option.firstName} ${option.middleName ?? ""} ${
                                            option.lastName
                                        } (id:${option.id})`
                                    }
                                    loading={doctorLoading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            sx={{ fontSize: "0.8rem" }}
                                            label="Doctor"
                                            required
                                        />
                                    )}
                                />
                                <DateTimePicker
                                    label="Date"
                                    value={appointmentDate}
                                    onChange={(v) => {
                                        if (v) setAppointmentDate(v);
                                    }}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    sx={{
                                        "& .MuiInputBase-root": { fontSize: "0.8rem" },
                                    }}
                                    minDate={dayjs()}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                />
                                <div>
                                    <Checkbox
                                        checked={approve}
                                        onChange={(_, value) => setApprove(value)}
                                    />
                                    <label>Approve</label>
                                </div>
                                <button
                                    className={commonStyles.button}
                                    style={{ justifyContent: "center" }}
                                    onClick={handleSubmit}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                        <a onClick={handleClose} className={commonStyles.closeButton}>
                            <ImCross size="14px" />
                        </a>
                    </>
                )}
            </Box>
        </Modal>
    );
}

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid grey",
    boxShadow: 24,
    pl: 10,
    pr: 10,
    pb: 10,
    pt: 5,
};

const style: { [key: string]: React.CSSProperties } = {
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginBottom: "20px",
    },
};

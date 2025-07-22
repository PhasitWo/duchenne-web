import { FormEvent, useEffect, useRef, useState } from "react";
import commonStyles from "../../styles/common.module.css";
import { Modal, Box, Autocomplete, TextField, Checkbox } from "@mui/material";
import {  TrimDoctor, Patient, Appointment } from "../../model/model";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { ImCross } from "react-icons/im";
import Loading from "../../pages/loading";
import ConfirmModal from "./confirmModal";
import { useAppointmentStore } from "../../stores/appointment";
import { useDoctorStore } from "../../stores/doctor";
import { usePatientStore } from "../../stores/patient";

interface EditAppointmentModalProps {
    open: boolean;
    setOpen: Function;
    initialData: Appointment | null;
    onComplete: Function;
}

export default function EditAppointmentModal({ open, setOpen, onComplete, initialData }: EditAppointmentModalProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [appointmentDate, setAppointmentDate] = useState(dayjs());
    const [approve, setApprove] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { listDoctors } = useDoctorStore();
    const { listPatients } = usePatientStore();
    const { updateAppointment, deleteAppointment } = useAppointmentStore();

    useEffect(() => {
        if (initialData) {
            setSelectedPatient(initialData.patient);
            setSelectedDoctor(initialData?.doctor);
            setApprove(initialData.approveAt === null ? false : true);
            setAppointmentDate(dayjs(initialData.date * 1000));
        }
    }, [initialData]);

    // onmount
    useEffect(() => {
        if (open) {
            fetchDoctors();
            fetchPatients();
        }
    }, [open]);

    // doctor
    const [selectedDoctor, setSelectedDoctor] = useState<TrimDoctor | null>(null);
    const [doctorList, setDoctorList] = useState<TrimDoctor[]>([]);
    const [doctorLoading, setDoctorLoading] = useState(false);

    const fetchDoctors = async () => {
        setDoctorLoading(true);
        const res = await listDoctors();
        setDoctorList(res);
        setDoctorLoading(false);
    };

    // patient
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientList, setPatientList] = useState<Patient[]>([]);
    const [patientLoading, setPatientLoading] = useState(false);

    const fetchPatients = async () => {
        setPatientLoading(true);
        const res = await listPatients();
        setPatientList(res);
        setPatientLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        // // reset
        // setApprove(false);
        // setSelectedPatient(null);
        // setSelectedDoctor(null);
        // setAppointmentDate(dayjs());
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        if (!initialData) return console.log("no initialData");

        setIsLoading(true);
        const succeed = await updateAppointment({
            appointmentId: initialData.id,
            doctorId: selectedDoctor!.id,
            patientId: selectedPatient!.id,
            dateUnix: appointmentDate.unix(),
            approve,
        });
        setIsLoading(false);
        if (succeed) {
            onComplete();
            setOpen(false);
        }
    };

    // confirm modal
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpenDeleteDialog = (e: FormEvent) => {
        e.preventDefault();
        setOpenConfirm(true);
    };

    const handleDelete = async () => {
        if (!initialData) return console.log("no initialData");

        setIsLoading(true);
        const succeed = await deleteAppointment(initialData.id);
        setIsLoading(false);
        if (succeed) {
            onComplete();
            setOpen(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                {isLoading ? (
                    <Loading />
                ) : initialData === null ? (
                    <div>no appointment to edit</div>
                ) : (
                    <>
                        <ConfirmModal
                            open={openConfirm}
                            setOpen={setOpenConfirm}
                            onConfirm={handleDelete}
                            message="Do you want to delete this appointment?"
                            confirmButtonLabel="Delete"
                        />
                        <h1 style={{ textAlign: "center" }}>Edit Appointment</h1>
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
                                        `${option.firstName} ${option.middleName ?? ""} ${option.lastName} (id:${
                                            option.id
                                        })`
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
                                        `${option.firstName} ${option.middleName ?? ""} ${option.lastName} (id:${
                                            option.id
                                        })`
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
                                    <Checkbox checked={approve} onChange={(_, value) => setApprove(value)} />
                                    <label>Approve</label>
                                </div>
                                <button
                                    className={commonStyles.button}
                                    style={{ justifyContent: "center" }}
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                                <button
                                    className={commonStyles.deleteButton}
                                    style={{ justifyContent: "center" }}
                                    onClick={handleOpenDeleteDialog}
                                >
                                    Delete
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
    pb: 5,
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

import { useEffect, useRef, useState } from "react";
import { ErrResponse, Patient } from "../model/model";
import MedicineDataGrid, { ExtendedMedicine } from "./medicineDataGrid";
import EditButton from "./editButton";
import CancelButton from "./cancelButton";
import SaveButton from "./saveButton";
import { Permission, useAuthApiContext } from "../hooks/authApiContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import commonStyles from "../styles/common.module.css";
import { GridRowModesModel } from "@mui/x-data-grid";

export default function PatientMedicineSection({ patient, onUpdateComplete }: { patient: Patient, onUpdateComplete: Function }) {
    const [isLoading, setIsLoading] = useState(false);
    const { api, checkPermission } = useAuthApiContext();
    const medicinesRef = useRef<ExtendedMedicine[]>([]); // save prevState on editing
    const [medicines, setMedicines] = useState<ExtendedMedicine[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [onEdit, setOnEdit] = useState(false);

    useEffect(() => {
        console.log("UPDATED", patient.medicine)
        if (patient.medicine) {
            medicinesRef.current = patient.medicine;
            setMedicines([...patient.medicine]);
        }
    }, [patient]);

    const handleSave = async () => {
        // validate
        if (Object.keys(rowModesModel).length > 0) {
            toast.error("please save the 'unsaved' rows")
            return;
        }
        for (let m of medicines) {
            if (m.description?.trim() === "") m.description = null
            if (m.isNew == true) {
                toast.error("please save the 'unsaved' rows")
                return;
            }
            if (m.medicineName.trim() === "") {
                toast.error("empty record is not allowed")
                return;
            }
        }
        setIsLoading(true);
        try {
            const res = await api.put(`/api/patient/${patient.id}/medicine`, {data: medicines});
            switch (res.status) {
                case 200:
                    toast.success("Patient's medicine list is updated!");
                    onUpdateComplete()
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    setMedicines(medicinesRef.current) // reset
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                setMedicines(medicinesRef.current) // reset
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setOnEdit(false);
            setIsLoading(false);
        }
    };

    return (
        <div id="patient-medicine">
            <h3>Medicine</h3>
            <div style={{ display: "flex", gap: "20px" }}>
                {onEdit ? (
                    <>
                        <CancelButton
                            onClick={() => {
                                setMedicines(medicinesRef.current);
                                setOnEdit(false);
                            }}
                        />
                        <SaveButton onClick={handleSave} />
                    </>
                ) : (
                    <EditButton onClick={() => setOnEdit(true)} disabled={!checkPermission(Permission.updatePatientPermission)} />
                )}
            </div>
            <MedicineDataGrid
                disableRowSelectionOnClick
                className={commonStyles.miniDatagridContainer}
                loading={isLoading}
                rows={medicines}
                setRows={setMedicines}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                style={{marginTop: "10px", marginBottom: "10px" }}
                disabled={!onEdit}
            />
        </div>
    );
}

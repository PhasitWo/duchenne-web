import { useEffect, useRef, useState } from "react";
import { Patient } from "../model/model";
import MedicineDataGrid, { ExtendedMedicine } from "./datagrid/medicineDataGrid";
import EditButton from "./editButton";
import CancelButton from "./cancelButton";
import SaveButton from "./saveButton";
import { toast } from "react-toastify";
import commonStyles from "../styles/common.module.css";
import { GridRowModesModel } from "@mui/x-data-grid";
import { useAuthStore } from "../stores/auth";
import { Permission } from "../constants/permission";
import { usePatientStore } from "../stores/patient";

export default function PatientMedicineSection({
    patient,
    onUpdateComplete,
}: {
    patient: Patient;
    onUpdateComplete: Function;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const checkPermission = useAuthStore((state) => state.checkPermission);
    const medicinesRef = useRef<ExtendedMedicine[]>([]); // save prevState on editing
    const [medicines, setMedicines] = useState<ExtendedMedicine[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [onEdit, setOnEdit] = useState(false);
    const updatePatientMedicine = usePatientStore((state) => state.updatePatientMedicine);

    useEffect(() => {
        if (patient.medicine) {
            medicinesRef.current = patient.medicine;
            setMedicines([...patient.medicine]);
        }
    }, [patient]);

    const handleSave = async () => {
        // validate
        if (Object.keys(rowModesModel).length > 0) {
            toast.error("please save the 'unsaved' rows");
            return;
        }
        for (let m of medicines) {
            if (m.dose?.trim() === "") m.dose = null;
            if (m.frequencyPerDay?.trim() === "") m.frequencyPerDay = null;
            if (m.instruction?.trim() === "") m.instruction = null;
            if (m.quantity?.trim() === "") m.quantity = null;
            if (m.isNew == true) {
                toast.error("please save the 'unsaved' rows");
                return;
            }
            if (m.medicineName.trim() === "") {
                toast.error("empty record is not allowed");
                return;
            }
        }
        setIsLoading(true);
        const succeed = await updatePatientMedicine(patient.id, medicines);
        if (succeed) onUpdateComplete();
        else setMedicines(medicinesRef.current); // reset
        setOnEdit(false);
        setIsLoading(false);
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
                    <EditButton
                        onClick={() => setOnEdit(true)}
                        disabled={!checkPermission(Permission.updatePatientPermission)}
                    />
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
                style={{ marginTop: "10px", marginBottom: "10px" }}
                disabled={!onEdit}
            />
        </div>
    );
}

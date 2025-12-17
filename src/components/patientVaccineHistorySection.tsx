import { useEffect, useRef, useState } from "react";
import { Patient } from "../model/model";
import EditButton from "./editButton";
import CancelButton from "./cancelButton";
import SaveButton from "./saveButton";
import { toast } from "react-toastify";
import commonStyles from "../styles/common.module.css";
import { GridRowModesModel } from "@mui/x-data-grid";
import VaccineHistoryDataGrid, { ExtendedVaccineHistory } from "./datagrid/vaccineHistoryDataGrid";
import type { VaccineHistory } from "../model/model";
import { useAuthStore } from "../stores/auth";
import { Permission } from "../constants/permission";
import { usePatientStore } from "../stores/patient";

export default function PatientVaccineHistorySection({
    patient,
    onUpdateComplete,
}: {
    patient: Patient;
    onUpdateComplete: Function;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const checkPermission = useAuthStore((state) => state.checkPermission);
    const vaccineHistoryRef = useRef<ExtendedVaccineHistory[]>([]); // save prevState on editing
    const [vaccineHistory, setVaccineHistory] = useState<ExtendedVaccineHistory[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [onEdit, setOnEdit] = useState(false);
    const updatePateintVaccineHistory = usePatientStore((state) => state.updatePateintVaccineHistory);

    useEffect(() => {
        if (patient.vaccineHistory) {
            // convert date
            let converted = patient.vaccineHistory.map((v) => ({
                ...v,
                vaccineAt: new Date(v.vaccineAt * 1000),
            }));
            // set
            vaccineHistoryRef.current = converted;
            setVaccineHistory(converted);
        }
    }, [patient]);

    const handleSave = async () => {
        // validate
        if (Object.keys(rowModesModel).length > 0) {
            toast.error("please save the 'unsaved' rows");
            return;
        }
        const converted = vaccineHistory.map<VaccineHistory & { isNew?: boolean }>((v) => ({
            ...v,
            vaccineAt: Math.floor(v.vaccineAt.getTime() / 1000), // convert to unix (sec)
        }));

        for (let v of converted) {
            if (v.vaccineLocation?.trim() === "") v.vaccineLocation = null;
            if (v.complication?.trim() === "") v.complication = null;
            if (v.isNew == true) {
                toast.error("please save the 'unsaved' rows");
                return;
            }
            if (v.vaccineName.trim() === "") {
                toast.error("empty 'vaccine name' is not allowed");
                return;
            }
        }
        setIsLoading(true);
        const succeed = await updatePateintVaccineHistory(patient.id, converted);
        if (succeed) onUpdateComplete();
        else setVaccineHistory(vaccineHistoryRef.current); // reset
        setOnEdit(false);
        setIsLoading(false);
    };

    return (
        <div id="patient-vaccineHistory">
            <h3>Vaccine History</h3>
            <div style={{ display: "flex", gap: "20px" }}>
                {onEdit ? (
                    <>
                        <CancelButton
                            onClick={() => {
                                setVaccineHistory(vaccineHistoryRef.current);
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
            <VaccineHistoryDataGrid
                disableRowSelectionOnClick
                className={commonStyles.miniDatagridContainer}
                loading={isLoading}
                rows={vaccineHistory}
                setRows={setVaccineHistory}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                style={{ marginTop: "10px", marginBottom: "10px" }}
                disabled={!onEdit}
            />
        </div>
    );
}

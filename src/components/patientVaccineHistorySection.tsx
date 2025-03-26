import { useEffect, useRef, useState } from "react";
import { ErrResponse, Patient } from "../model/model";
import EditButton from "./editButton";
import CancelButton from "./cancelButton";
import SaveButton from "./saveButton";
import { Permission, useAuthApiContext } from "../hooks/authApiContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import commonStyles from "../styles/common.module.css";
import { GridRowModesModel } from "@mui/x-data-grid";
import VaccineHistoryDataGrid, { ExtendedVaccineHistory } from "./vaccineHistoryDataGrid";
import type { VaccineHistory } from "../model/model";

export default function PatientVaccineHistorySection({
    patient,
    onUpdateComplete,
}: {
    patient: Patient;
    onUpdateComplete: Function;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { api, checkPermission } = useAuthApiContext();
    const vaccineHistoryRef = useRef<ExtendedVaccineHistory[]>([]); // save prevState on editing
    const [vaccineHistory, setVaccineHistory] = useState<ExtendedVaccineHistory[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [onEdit, setOnEdit] = useState(false);

    useEffect(() => {
        console.log("UPDATED", patient.vaccineHistory);
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
            if (v.description?.trim() === "") v.description = null;
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
        try {
            const res = await api.put(`/api/patient/${patient.id}/vaccineHistory`, {
                data: converted,
            });
            switch (res.status) {
                case 200:
                    toast.success("Patient's vaccine history is updated!");
                    onUpdateComplete();
                    break;
                case 404:
                    toast.error("This patient is not in the database");
                    setVaccineHistory(vaccineHistoryRef.current); // reset
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                setVaccineHistory(vaccineHistoryRef.current); // reset
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setOnEdit(false);
            setIsLoading(false);
        }
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
                    <EditButton onClick={() => setOnEdit(true)} disabled={!checkPermission(Permission.updatePatientPermission)} />
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

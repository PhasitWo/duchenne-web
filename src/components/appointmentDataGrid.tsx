import { DataGrid, GridColDef, GridPaginationModel, type DataGridProps } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Appointment, ErrResponse } from "../model/model";
import { useAuthApiContext } from "../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import styles from "../styles/common.module.css";
import Chip from "@mui/material/Chip";
import { MdOutlineModeEditOutline } from "react-icons/md";
import EditAppointmentModal from "./modal/editAppointmentModal";
import ConfirmModal from "./modal/confirmModal";

export type AppointmentType = "incoming" | "history";

interface AppointmentDataGridProps {
    type: AppointmentType;
    doctorId?: number;
    patientId?: number;
}

export default function AppointmentDataGrid({
    type = "incoming",
    doctorId,
    patientId,
    ...rest
}: Omit<DataGridProps, "columns"> & AppointmentDataGridProps) {
    const [rows, setRows] = useState<Appointment[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toEditAppointment, setToEditAppointment] = useState<Appointment | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const { api } = useAuthApiContext();

    const handlePaginationModelChange = async (model: GridPaginationModel) => {
        await fetch(model.pageSize, model.page * model.pageSize);
        setPaginationModel(model);
    };

    useEffect(() => {
        setPaginationModel({ ...paginationModel, page: 0 });
        fetch(paginationModel.pageSize, 0);
    }, [type, doctorId, patientId]);

    const attachQueryParams = (url: string, limit: number, offset: number) => {
        url +=
            `?type=${type}` +
            (doctorId ? `&doctorId=${doctorId}` : "") +
            (patientId ? `&patientId=${patientId}` : "") +
            `&limit=${limit}` +
            `&offset=${offset}`;
        return url;
    };
    const fetch = async (limit: number, offset: number) => {
        setIsLoading(true);
        try {
            let res = await api.get<Appointment[]>(
                attachQueryParams("/api/appointment", limit + 1, offset)
            );
            switch (res.status) {
                case 200:
                    if (res.data.length == limit + 1) {
                        res.data.pop();
                        setHasNextPage(true);
                    } else {
                        setHasNextPage(false);
                    }
                    setRows(res.data);
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

    // confirm modal
    const [openConfirm, setOpenConfirm] = useState(false);
    const handleApprove = async () => {
        if (!toEditAppointment) return console.log("no appointment to approve");
        setIsLoading(true);
        try {
            let res = await api.put<{ id: number }>(`/api/appointment/${toEditAppointment.id}`, {
                doctorId: toEditAppointment!.doctor.id,
                patientId: toEditAppointment!.patient.id,
                date: toEditAppointment.date,
                approve: true,
            });
            switch (res.status) {
                case 200:
                    await fetch(
                        paginationModel.pageSize,
                        paginationModel.page * paginationModel.pageSize
                    );
                    toast.success("Appointment is approved!");
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

    const columns: GridColDef<Appointment>[] = [
        { field: "id", headerName: "ID", width: 60 },
        {
            field: "patientName",
            headerName: "Patient",
            flex: 2,
            valueGetter: (_, r) =>
                `${r.patient.firstName} ${r.patient.middleName ?? ""} ${r.patient.lastName}`,
            renderCell: (v) => (
                <NavLink to={`/patient/${v.row.patient.id}`} className={styles.navLink}>
                    {v.value}
                </NavLink>
            ),
        },
        {
            field: "doctorName",
            headerName: "Doctor",
            flex: 2,
            valueGetter: (_, r) =>
                `${r.doctor.firstName} ${r.doctor.middleName ?? ""} ${r.doctor.lastName}`,
            renderCell: (v) => (
                <NavLink to={`/doctor/${v.row.doctor.id}`} className={styles.navLink}>
                    {v.value}
                </NavLink>
            ),
        },
        {
            field: "createAt",
            headerName: "Create At",
            flex: 2,
            valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
        },
        {
            field: "date",
            headerName: "Appointment Date",
            flex: 2,
            valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
        },
        {
            field: "status",
            headerName: "Status",
            headerAlign: "center",
            align: "center",
            flex: 1.5,
            valueOptions: ["Approved", "Pending"],
            valueGetter: (_, r) => {
                return r.approveAt ? "Approved" : "Pending";
            },
            renderCell: (v) => (
                <Chip
                    label={v.value}
                    color={v.value == "Approved" ? "success" : "warning"}
                    variant="outlined"
                />
            ),
        },
        {
            field: "action",
            headerName: "Action",
            headerAlign: "center",
            align: "center",
            flex: 2,
            renderCell: (v) => (
                <AppointmentAction
                    appointment={v.row}
                    onClickEdit={() => {
                        setToEditAppointment(v.row);
                        setOpenEdit(true);
                    }}
                    onClickApprove={() => {
                        setToEditAppointment(v.row);
                        setOpenConfirm(true);
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <EditAppointmentModal
                initialData={toEditAppointment}
                open={openEdit}
                setOpen={setOpenEdit}
                onComplete={() =>
                    fetch(paginationModel.pageSize, paginationModel.page * paginationModel.pageSize)
                }
            />
            <ConfirmModal
                open={openConfirm}
                setOpen={setOpenConfirm}
                message={`Do you want to approve this appointment : id ${toEditAppointment?.id}`}
                confirmButtonLabel="Approve"
                onConfirm={handleApprove}
            />
            <DataGrid
                {...rest}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "date", sort: "asc" }],
                    },
                }}
                rows={rows}
                columns={columns}
                rowCount={
                    hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + rows.length
                }
                paginationMeta={{ hasNextPage: hasNextPage }}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[10, 20, 50]}
                loading={isLoading}
            />
        </>
    );
}

function AppointmentAction({
    appointment,
    onClickEdit,
    onClickApprove,
}: {
    appointment: Appointment;
    onClickEdit: Function;
    onClickApprove: Function;
}) {
    const isHistory = appointment.date < dayjs().unix();
    const isApproved = appointment.approveAt !== null;
    const isActive = !isApproved || !isHistory;
    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "25px",
            }}
        >
            <button
                className={styles.outlinedButton}
                disabled={isHistory || isApproved}
                onClick={() => onClickApprove()}
            >
                Approve
            </button>
            <MdOutlineModeEditOutline
                size={17}
                style={isActive ? style.iconActive : style.iconDisabled}
                onClick={() => isActive && onClickEdit()}
            />
        </div>
    );
}

const style: { [key: string]: React.CSSProperties } = {
    iconActive: {
        cursor: "pointer",
    },
    iconDisabled: {
        opacity: 0,
    },
};

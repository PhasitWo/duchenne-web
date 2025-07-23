import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlotProps,
    GridValidRowModel,
    DataGridProps,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { Dispatch, SetStateAction } from "react";
import { VaccineHistory } from "../model/model";

export type ExtendedVaccineHistory = Omit<VaccineHistory, "vaccineAt"> & GridValidRowModel & {vaccineAt: Date};

interface VaccineHistoryDataGridProps {
    rows: ExtendedVaccineHistory[];
    setRows: Dispatch<SetStateAction<ExtendedVaccineHistory[]>>;
    rowModesModel: GridRowModesModel;
    setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
    disabled?: boolean;
}

export default function VaccineHistoryDataGrid({
    rows,
    setRows,
    rowModesModel,
    setRowModesModel,
    disabled,
    ...rest
}: Omit<DataGridProps, "columns"> & VaccineHistoryDataGridProps) {
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        { field: "vaccineName", headerName: "Name", type: "string", flex: 1, editable: !disabled },
        {
            field: "vaccineLocation",
            headerName: "Location",
            type: "string",
            flex: 1,
            align: "left",
            headerAlign: "left",
            editable: !disabled,
        },
        {
            field: "vaccineAt",
            headerName: "Date",
            type: "date",
            flex: 1,
            align: "left",
            headerAlign: "left",
            editable: !disabled,
            valueFormatter: (v) => {
                return (v as Date).toLocaleDateString("en-GB")
            }
        },
        {
            field: "complication",
            headerName: "Complication",
            type: "string",
            flex: 2,
            align: "left",
            headerAlign: "left",
            editable: !disabled,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                if (disabled) return [<></>];

                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: "50vh",
                width: "40vw",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                {...rest}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "vaccineAt", sort: "asc" }],
                    },
                }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, disabled },
                    
                }}
            />
        </Box>
    );
}

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        setRows: any;
        setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
        disabled?: boolean;
    }
}

function EditToolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel, disabled } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows: any) => [
            ...oldRows,
            {
                id,
                vaccineName: "",
                vaccineLocation: "",
                vaccineAt: new Date(),
                description: "",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "medicineName" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
                disabled={disabled}
            >
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

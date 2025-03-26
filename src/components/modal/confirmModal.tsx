import { Modal, Box } from "@mui/material";
import commonStyles from "../../styles/common.module.css";

interface ConfirmModalProps {
    open: boolean;
    setOpen: Function;
    onConfirm: Function;
    message?: string;
    confirmButtonLabel?: string;
}

export default function ConfirmModal({
    open,
    setOpen,
    message,
    confirmButtonLabel,
    onConfirm,
}: ConfirmModalProps) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <h3 style={{ textAlign: "center" }}>
                    {message ?? "Do you want to confirm the action?"}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <button
                        className={commonStyles.button}
                        style={{ justifyContent: "center" }}
                        onClick={() => {
                            onConfirm();
                            handleClose();
                        }}
                    >
                        {confirmButtonLabel ?? "Confirm"}
                    </button>
                    <button
                        className={commonStyles.outlinedButton}
                        style={{ justifyContent: "center" }}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
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
    pl: 5,
    pr: 5,
    pb: 5,
    pt: 5,
};

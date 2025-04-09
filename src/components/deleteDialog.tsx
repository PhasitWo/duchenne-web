import { useState, forwardRef, ForwardedRef, MutableRefObject } from "react";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import deleteDialogStyles from "../styles/deleteDialog.module.css";
import { CircularProgress } from "@mui/material";


export default forwardRef<HTMLDialogElement, { deleteFunc: () => Promise<void> }>(DeleteDialog);
type DeleteDialogProps = { deleteFunc: () => Promise<any> };

const confirmToken = "delete";

function DeleteDialog(props: DeleteDialogProps, ref: ForwardedRef<HTMLDialogElement>) {
    const { deleteFunc } = props;
    const [confirmText, setConfirmText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const closeDialog = () => {
        (ref as MutableRefObject<HTMLDialogElement>).current.close();
    };
    const handleDelete = () => {
        if (confirmText !== confirmToken) {
            toast.error(`type '${confirmToken}' in the field!`);
            return;
        }
        setIsLoading(true);
        deleteFunc().finally(() => {
            setIsLoading(false);
            closeDialog();
        });
    };
    return (
        <dialog ref={ref} className={deleteDialogStyles.dialog}>
            <div className={deleteDialogStyles.content}>
                {isLoading ? (
                    <CircularProgress color="info" size="60px" />
                ) : (
                    <>
                        <h2>Type 'delete' to confirm</h2>
                        <div>
                            <input
                                type="text"
                                className={deleteDialogStyles.input}
                                placeholder={confirmToken}
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                            <button className={deleteDialogStyles.button} onClick={() => handleDelete()}>
                                Confirm
                            </button>
                        </div>
                        <ImCross className={deleteDialogStyles.closeButton} onClick={() => closeDialog()} />
                    </>
                )}
            </div>
        </dialog>
    );
}

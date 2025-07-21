import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { CiTrash } from "react-icons/ci";
import GoBack from "../../components/goback";
import { Content, ErrResponse } from "../../model/model";
import Loading from "../loading";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Checkbox } from "@mui/material";
import DeleteDialog from "../../components/deleteDialog";
import "react-quill/dist/quill.snow.css";
import Editor from "../../components/editor";
import api from "../../services/api";

export default function ViewContent() {
    // hook
    const { id } = useParams();
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const infoRef = useRef<Content>(); // save prevState on editing
    const [info, setInfo] = useState<Content>(initialInfo);
    const [onEdit, setOnEdit] = useState(false);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetch();
    }, []);
    const fetch = async () => {
        try {
            let res = await api.get<Content>("/api/content/" + id);
            switch (res.status) {
                case 200:
                    infoRef.current = res.data;
                    setInfo(res.data);
                    break;
                case 404:
                    navigate("/notFound");
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

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;

        setIsLoading(true);
        try {
            const res = await api.put("/api/content/" + id, info);
            switch (res.status) {
                case 200:
                    toast.success("Updated!");
                    navigate("/reload");
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
                case 404:
                    toast.error("This content is not in the database");
                    break;
                case 409:
                    toast.error("Duplicate username");
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

    const handleDelete = async () => {
        try {
            const res = await api.delete("/api/content/" + id);
            switch (res.status) {
                case 204:
                    toast.success("Deleted!");
                    navigate("/content");
                    break;
                case 403:
                    toast.error("Insufficient permission");
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        }
    };

    const uploadImage = useCallback(async (file: File) => {
        const form = new FormData();
        form.append("image", file);

        let ret = null;
        setIsUploading(true);
        let toastId = toast.loading("Uploading image...");
        try {
            const res = await api.post<{ publicURL: string }>("/api/image/upload", form);
            switch (res.status) {
                case 201:
                    toast.success("Image uploaded!");
                    ret = res.data.publicURL;
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            toast.done(toastId);
            setIsUploading(false);
            return ret;
        }
    }, []);

    if (isLoading) return <Loading />;
    return (
        <>
            <DeleteDialog deleteFunc={handleDelete} ref={deleteDialogRef} />
            <Header>{`${info.title}`}</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Content</h3>
                        {!onEdit && (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    setOnEdit(true);
                                    infoRef.current = info;
                                }}
                            >
                                <GoPencil />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>ID</label>
                        <input type="text" className={styles.infoInput} value={info.id} disabled />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Title</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.title}
                            onChange={(e) => setInfo({ ...info, title: e.target.value })}
                            disabled={!onEdit}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Order</label>
                        <input
                            type="number"
                            min={1}
                            className={styles.infoInput}
                            value={info.order}
                            onChange={(e) => setInfo({ ...info, order: e.target.valueAsNumber })}
                            disabled={!onEdit}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Published</label>
                        <Checkbox
                            sx={{ width: "fit-content", padding: 0 }}
                            checked={info.isPublished}
                            onChange={(_, v) => setInfo({ ...info, isPublished: v })}
                            disabled={!onEdit}
                        />
                    </div>
                    <div style={{ padding: "20px 0 20px 0" }}>
                        <Editor value={info.body} onChange={(v) => setInfo({ ...info, body: v })} readonly={!onEdit} uploadImageFunc={uploadImage} />
                    </div>
                    {onEdit && (
                        <div className={styles.infoFooter}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => deleteDialogRef.current!.showModal()}
                            >
                                <CiTrash />
                                <span>Delete</span>
                            </button>
                            <div className={styles.infoCancelSaveContainer}>
                                <button
                                    className={styles.outlinedButton}
                                    onClick={() => {
                                        setOnEdit(false);
                                        setInfo(infoRef.current as Content);
                                    }}
                                >
                                    <ImCancelCircle />
                                    <span>Cancel</span>
                                </button>
                                <button className={styles.button} onClick={handleSave}>
                                    <IoSaveOutline />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

const initialInfo: Content = {
    id: -1,
    createAt: -1,
    updateAt: -1,
    title: "",
    body: "",
    isPublished: false,
    order: -1,
};

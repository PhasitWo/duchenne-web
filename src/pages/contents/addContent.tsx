import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useCallback, useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import GoBack from "../../components/goback";
import { useAuthApiContext } from "../../hooks/authApiContext";
import { Content, ErrResponse } from "../../model/model";
import Loading from "../loading";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Checkbox } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "../../components/editor";

export default function AddContent() {
    // hook
    const { api } = useAuthApiContext();
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [info, setInfo] = useState<Content>(initialInfo);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;

        setIsLoading(true);
        try {
            const res = await api.post("/api/content", info);
            switch (res.status) {
                case 201:
                    toast.success("New content created!");
                    navigate("/content/" + res.data.id);
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
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImage = useCallback(async (file: File) => {
        const form = new FormData();
        form.append("image", file);

        let ret = null;
        setIsUploading(true);
        let toastId = toast.loading("Uploading image...")
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
            toast.done(toastId)
            setIsUploading(false);
            return ret;
        }
    }, []);

    if (isLoading) return <Loading />;
    return (
        <>
            <Header>Add New Content</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Content</h3>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Title</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.title}
                            onChange={(e) => setInfo({ ...info, title: e.target.value })}
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
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Published</label>
                        <Checkbox
                            sx={{ width: "fit-content", padding: 0 }}
                            checked={info.isPublished}
                            onChange={(_, v) => setInfo({ ...info, isPublished: v })}
                        />
                    </div>
                    <div style={{ padding: "20px 0 20px 0" }}>
                        <Editor
                            value={info.body}
                            onChange={(v) => setInfo({ ...info, body: v })}
                            uploadImageFunc={uploadImage}
                            readonly={isUploading}
                        />
                    </div>

                    <div className={styles.infoFooter}>
                        <button className={styles.button} onClick={handleSave}>
                            <IoSaveOutline />
                            <span>Save</span>
                        </button>
                    </div>
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
    order: 1,
};

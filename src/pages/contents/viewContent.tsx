import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { ChangeEventHandler, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { CiTrash } from "react-icons/ci";
import GoBack from "../../components/goback";
import { Content, ContentType } from "../../model/model";
import Loading from "../loading";
import { Checkbox, MenuItem, Select } from "@mui/material";
import DeleteDialog from "../../components/deleteDialog";
import "react-quill/dist/quill.snow.css";
import Editor from "../../components/editor";
import { useContentStore } from "../../stores/content";
import { toast } from "react-toastify";

export default function ViewContent({ createMode = false }) {
    // hook
    const { id } = useParams();
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const infoRef = useRef<Content>(initialInfo); // save prevState on editing
    const [info, setInfo] = useState<Content>(initialInfo);
    const [onEdit, setOnEdit] = useState(false);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const uploadImage = useContentStore((state) => state.uploadImage);
    const getContent = useContentStore((state) => state.getContent);
    const updateContent = useContentStore((state) => state.updateContent);
    const deleteContent = useContentStore((state) => state.deleteContent);
    const createContent = useContentStore((state) => state.createContent);
    // cover image
    const [useCover, setUseCover] = useState(false);
    const inputCoverRef = useRef<HTMLInputElement>(null);
    const [toUploadCover, setToUploadCover] = useState<File | null>(null);
    const toUploadTempURL = useMemo(() => {
        if (toUploadCover) return URL.createObjectURL(toUploadCover);
        else return null;
    }, [toUploadCover]);

    useEffect(() => {
        if (!createMode) fetch();
    }, [id]);

    const fetch = async () => {
        if (!id) return;
        setIsLoading(true);
        const data = await getContent(id);
        setIsLoading(false);
        if (data) {
            infoRef.current = data;
            setInfo(data);
            // cover image
            processUseCover(data);
        } else if (data === null) navigate("/notFound");
    };

    const processUseCover = (source: Content) => {
        if (source.coverImageURL !== null) setUseCover(true);
        else setUseCover(false);
    };

    const handleCoverSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
        let files = e.target.files;
        if (files) {
            setToUploadCover(files[0]);
            inputCoverRef.current!.value = ""; // clear input
        }
    };

    const handleUseCoverChecked = (value: boolean) => {
        setUseCover(value);
        if (value) {
            setInfo({ ...info, coverImageURL: infoRef.current!.coverImageURL });
        } else {
            setInfo({ ...info, coverImageURL: null });
        }
        setToUploadCover(null);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        if (info.body.trim() === "") {
            toast.error("Content body cannot be empty");
            return;
        }
        let data = { ...info };
        // upload image first
        if (toUploadCover) {
            const url = await uploadImage(toUploadCover);
            if (url) data.coverImageURL = url;
            else return;
        }

        if (createMode) {
            setIsLoading(true);
            const newId = await createContent(data);
            setIsLoading(false);
            if (newId) navigate("/content/" + newId);
        } else {
            setIsLoading(true);
            const succeed = await updateContent(id!, data);
            setIsLoading(false);
            if (succeed) navigate("/reload");
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        setIsLoading(true);
        const succeed = await deleteContent(id);
        setIsLoading(false);
        if (succeed) navigate("/content");
    };

    const handleUploadImage = useCallback(async (file: File) => {
        setIsUploading(true);
        const url = await uploadImage(file);
        setIsUploading(false);
        return url;
    }, []);

    if (isLoading) return <Loading />;
    return (
        <>
            <DeleteDialog deleteFunc={handleDelete} ref={deleteDialogRef} />
            <Header>{createMode ? "Add New Content" : `${info.title}`}</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3>Content</h3>
                        {!createMode && !onEdit && (
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
                    {!createMode && (
                        <div className={styles.infoInputContainer}>
                            <label className={styles.infoLabel}>ID</label>
                            <input type="text" className={styles.infoInput} value={info.id} disabled />
                        </div>
                    )}
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Type</label>
                        <Select
                            value={info.contentType}
                            onChange={(e) => setInfo({ ...info, contentType: e.target.value as ContentType })}
                            size="small"
                            required
                            disabled={!createMode}
                        >
                            <MenuItem value="article">Article</MenuItem>
                            <MenuItem value="link">Link</MenuItem>
                        </Select>
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Title</label>
                        <input
                            type="text"
                            className={styles.infoInput}
                            value={info.title}
                            onChange={(e) => setInfo({ ...info, title: e.target.value })}
                            disabled={!createMode && !onEdit}
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
                            disabled={!createMode && !onEdit}
                            required
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Published</label>
                        <Checkbox
                            sx={{ width: "fit-content", padding: 0 }}
                            checked={info.isPublished}
                            onChange={(_, v) => setInfo({ ...info, isPublished: v })}
                            disabled={!createMode && !onEdit}
                        />
                    </div>
                    <div className={styles.infoInputContainer}>
                        <label className={styles.infoLabel}>Use Cover Image</label>
                        <div style={{ display: "inline-flex", gap: "20px" }}>
                            <Checkbox
                                sx={{ width: "fit-content", padding: 0 }}
                                checked={useCover}
                                onChange={(_, v) => handleUseCoverChecked(v)}
                                disabled={!createMode && !onEdit}
                            />
                            {useCover && (createMode || onEdit) && (
                                <>
                                    <button
                                        className={styles.button}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            inputCoverRef.current!.click();
                                        }}
                                    >
                                        Choose
                                    </button>
                                    {toUploadCover && (
                                        <button
                                            className={styles.outlinedButton}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setToUploadCover(null);
                                            }}
                                        >
                                            <ImCancelCircle />
                                            <span>Revert</span>
                                        </button>
                                    )}
                                </>
                            )}
                            <input
                                ref={inputCoverRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onInput={handleCoverSelect}
                            ></input>
                        </div>
                    </div>
                    <div style={{ width: "full" }}>
                        <div
                            style={{
                                backgroundImage: `url("${toUploadTempURL ?? info.coverImageURL}")`,
                            }}
                            className={styles.coverPreview}
                        >
                            <div style={{ fontWeight: "bold" }}>{info.title}</div>
                        </div>
                    </div>
                    {info.contentType === "article" && (
                        <div style={{ padding: "20px 0 20px 0" }}>
                            <Editor
                                value={info.body}
                                onChange={(v) => setInfo({ ...info, body: v })}
                                readonly={(!createMode && !onEdit) || isUploading}
                                uploadImageFunc={handleUploadImage}
                            />
                        </div>
                    )}
                    {info.contentType === "link" && (
                        <div className={styles.infoInputContainer} style={{ marginTop: "20px" }}>
                            <label className={styles.infoLabel}>URL</label>
                            <input
                                type="text"
                                className={styles.infoInput}
                                value={info.body}
                                onChange={(e) => setInfo({ ...info, body: e.target.value })}
                                disabled={!createMode && !onEdit}
                                required
                                placeholder="ex. https://youtu.be/jNQXAC9IVRw?si=7PCE0kmSRbUw2a64"
                            />
                        </div>
                    )}
                    <div className={styles.infoFooter}>
                        {onEdit && (
                            <>
                                <button
                                    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteDialogRef.current!.showModal();
                                    }}
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
                                            processUseCover(infoRef.current as Content);
                                            setToUploadCover(null);
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
                            </>
                        )}
                        {createMode && (
                            <button className={styles.button} onClick={handleSave}>
                                <IoSaveOutline />
                                <span>Create</span>
                            </button>
                        )}
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
    coverImageURL: null,
    contentType: "article",
};

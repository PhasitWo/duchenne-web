import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import styles from "../../styles/common.module.css";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import GoBack from "../../components/goback";
import { Consent } from "../../model/model";
import Loading from "../loading";
import "react-quill/dist/quill.snow.css";
import Editor from "../../components/editor";
import { useContentStore } from "../../stores/content";
import { toast } from "react-toastify";
import { useConsentStore } from "../../stores/consent";

export default function Privacy({ consentSlug }: { consentSlug: string }) {
    // hook
    const navigate = useNavigate();
    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const infoRef = useRef<Consent>({ ...initialInfo, slug: consentSlug });
    const [info, setInfo] = useState<Consent>({ ...initialInfo, slug: consentSlug });
    const [onEdit, setOnEdit] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { getConsentBySlug, upsertConsent } = useConsentStore();
    const uploadImage = useContentStore((state) => state.uploadImage);

    useEffect(() => {
        fetch();
    }, [consentSlug]);

    const fetch = async () => {
        setIsLoading(true);
        const data = await getConsentBySlug(consentSlug);
        setIsLoading(false);
        if (data) {
            infoRef.current = data;
            setInfo(data);
        } else if (data === null) toast.warn(`not found ${consentSlug}`);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        if (info.body.trim() === "") {
            toast.error("Content body cannot be empty");
            return;
        }
        let data = { ...info };
        setIsLoading(true);
        const succeed = await upsertConsent(data);
        setIsLoading(false);
        if (succeed) navigate("/reload");
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
            <Header>{consentSlug}</Header>
            <div id="content-body">
                <GoBack />
                <form id="info-container" ref={formRef} className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <h3></h3>
                        {onEdit ? (
                            <div className={styles.infoCancelSaveContainer}>
                                <button
                                    className={styles.outlinedButton}
                                    onClick={() => {
                                        setOnEdit(false);
                                        setInfo(infoRef.current as Consent);
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
                        ) : (
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
                        <label className={styles.infoLabel}>Slug</label>
                        <input type="text" className={styles.infoInput} value={info.slug} disabled />
                    </div>

                    <div style={{ padding: "20px 0 20px 0" }}>
                        <Editor
                            value={info.body}
                            onChange={(v) => setInfo({ ...info, body: v })}
                            readonly={!onEdit || isUploading}
                            uploadImageFunc={handleUploadImage}
                        />
                    </div>
                    <div className={styles.infoFooter}></div>
                </form>
            </div>
        </>
    );
}

const initialInfo = { id: -1, createAt: -1, updateAt: -1, slug: "", body: "" };

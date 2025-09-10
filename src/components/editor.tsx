import { ChangeEventHandler, useCallback, useMemo, useRef } from "react";
import ReactQuill, { ReactQuillProps, type Range } from "react-quill";

interface EditorProps {
    value: ReactQuillProps["value"];
    onChange: ReactQuillProps["onChange"];
    uploadImageFunc: (file: File) => Promise<string | undefined>;
    readonly?: ReactQuillProps["readOnly"];
}

export default function Editor({ value, onChange, uploadImageFunc, readonly = false }: EditorProps) {
    const ref = useRef<ReactQuill>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentRange = useRef<Range | null>(null);

    const imageHandler = useCallback(() => {
        if (!ref.current) return;
        const editor = ref.current.getEditor();
        const range = editor.getSelection();
        currentRange.current = range;
        fileInputRef.current!.click();
    }, []);

    const handleImageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        let files = e.target.files;
        if (files) {
            let url = await uploadImageFunc(files[0]);
            if (!url) return;
            if (!ref.current) return;
            const editor = ref.current.getEditor();
            if (url && currentRange.current) {
                editor.insertEmbed(currentRange.current.index, "image", url);
            }
            currentRange.current = null;
        }
    };

    const modules = useMemo<ReactQuillProps["modules"]>(
        () => ({
            toolbar: {
                container: [
                    [{ header: "1" }, { header: "2" }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["link", "image", "video"],
                    ["clean"],
                ],
                handlers: { image: imageHandler },
            },
        }),
        []
    );

    return (
        <>
            <ReactQuill
                ref={ref}
                modules={modules}
                value={value}
                onChange={onChange}
                readOnly={readonly}
                placeholder="Write your content..."
                preserveWhitespace
            />
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
            />
        </>
    );
}

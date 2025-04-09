import { useCallback, useMemo, useRef } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

interface EditorProps {
    value: ReactQuillProps["value"];
    onChange: ReactQuillProps["onChange"];
    readonly?: ReactQuillProps["readOnly"];
}

export default function Editor({ value, onChange, readonly = false }: EditorProps) {
    const ref = useRef<ReactQuill>(null);
    const imageHandler = useCallback(() => {
        if (!ref.current) return;

        const editor = ref.current!.getEditor();
        const range = editor.getSelection();
        const value = prompt("Please enter the image URL");

        if (value && range) {
            editor.insertEmbed(range.index, "image", value, "user");
        }
    }, []);

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
        <ReactQuill
            ref={ref}
            modules={modules}
            value={value}
            onChange={onChange}
            readOnly={readonly}
            placeholder="Write your content..."
        />
    );
}

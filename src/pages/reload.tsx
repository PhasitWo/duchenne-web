import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Reload() {
    const navigate = useNavigate();
    const fn = async () => {
        setTimeout(() => navigate(-1), 10);
    }
    useEffect(() => {
        fn()
    }, []);
    return <></>;
}

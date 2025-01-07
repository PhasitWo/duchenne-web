import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
    return (
        <div
            id="loading"
            style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress color="info" size={"10vw"} />
        </div>
    );
}

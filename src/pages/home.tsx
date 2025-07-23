import Header from "../components/header";
import img from "../assets/Branding_logo.png";

export default function Home() {
    return (
        <>
            <Header><h3>DMD We Care CMS</h3></Header>
            <div id="content-body">
                <div style={{width: "full", display: "flex"}}>
                    <img src={img} height={600} width={600} style={{ margin: "auto"}}></img>
                </div>
            </div>
        </>
    );
}

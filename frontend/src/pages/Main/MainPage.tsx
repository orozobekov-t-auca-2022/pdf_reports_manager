import { useState } from "react";
import PDFWindow from "../../components/PDFWindow/PDFWindow";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import styles from "./MainPage.module.css";

function MainPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFolderCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className={styles.mainPage}>
            <Sidebar key={refreshKey}/>
            <div>
                <Topbar onFolderCreated={handleFolderCreated}/>
                <PDFWindow/>
            </div>
        </div>
    );
}
export default MainPage;
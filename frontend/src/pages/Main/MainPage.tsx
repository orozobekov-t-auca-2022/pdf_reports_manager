import { useState } from "react";
import PDFWindow from "../../components/PDFWindow/PDFWindow";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import styles from "./MainPage.module.css";

function MainPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentFolderId, setCurrentFolderId] = useState<number | undefined>(undefined);
    const [selectedFileId, setSelectedFileId] = useState<number | undefined>(undefined);

    const handleFolderCreated = () => {
        console.log('MainPage: Folder created, updating refreshKey from', refreshKey, 'to', refreshKey + 1);
        setRefreshKey(prev => prev + 1);
    };

    const handleFileUploaded = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleFileSelect = (fileId: number | undefined) => {
        setSelectedFileId(fileId);
    };

    return (
        <div className={styles.mainPage}>
            <Sidebar 
                refreshTrigger={refreshKey}
                onFolderSelect={setCurrentFolderId}
                onFileSelect={handleFileSelect}
            />
            <div className="contentArea">
                <Topbar 
                    onFolderCreated={handleFolderCreated}
                    onFileUploaded={handleFileUploaded}
                    currentFolderId={currentFolderId}
                />
                <PDFWindow selectedFileId={selectedFileId}/>
            </div>
        </div>
    );
}
export default MainPage;
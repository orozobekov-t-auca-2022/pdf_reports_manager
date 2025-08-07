import { useEffect, useState, useMemo } from "react";
import SidebarListItem from "./SidebarListItem";
import DateGroup from "./groupByDate/DateGroup";
import styles from "./Sidebar.module.css";
import type { Folder, File, ApiResponse } from "../../types";
import { groupFilesByDate, getSortedDateKeys } from "../../utils/dateUtils";

interface SidebarProps {
    onFolderSelect?: (folderId: number | undefined) => void;
    onFileSelect?: (fileId: number | undefined) => void;
    refreshTrigger?: number;
}

function Sidebar({ onFolderSelect, onFileSelect, refreshTrigger }: SidebarProps = { onFolderSelect: undefined, onFileSelect: undefined, refreshTrigger: undefined }){
    const [activeButton, setActiveButton] = useState<string>('date');
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(undefined);

    useEffect(() => {
        console.log('Sidebar: useEffect triggered, refreshTrigger =', refreshTrigger);
        fetch('http://localhost:5000/api/folders')
            .then(res => res.json())
            .then((data: ApiResponse<Folder[]>) => {
                console.log('Sidebar: Fetched folders:', data.data);
                setFolders(data.data);
            })
            .catch(err => console.error('Error fetching folders:', err));

        fetch('http://localhost:5000/api/files/dates')
            .then(res => res.json())
            .then((data: ApiResponse<File[]>) => setFiles(data.data))
            .catch(err => console.error('Error fetching files:', err));
    }, [refreshTrigger])

    const sortedContent = useMemo(() => {
        if (activeButton === 'date') {
            const groupedFiles = groupFilesByDate(files);
            const sortedDateKeys = getSortedDateKeys(groupedFiles);
            return { type: 'dates', data: { groupedFiles, sortedDateKeys } };
        } else if (activeButton === 'folders') {
            return { 
                type: 'folders', 
                data: [...folders].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
            };
        }
        return { type: 'folders', data: folders };
    }, [folders, files, activeButton]);

    
    const handleButtonClick = (buttonType: string) => {
        setActiveButton(buttonType);
    };

    const handleFolderSelect = (folder: Folder) => {
        const newSelectedId = selectedFolderId === folder.id ? undefined : folder.id;
        setSelectedFolderId(newSelectedId);
        if (onFolderSelect) {
            onFolderSelect(newSelectedId);
        }
    };

    return(
        <div className={styles.sidebar}>
            <div className={styles.sidebarContainer}>
                <h3>Файлы</h3>
                <div className={styles.buttonGroup}>
                    <button 
                        className={activeButton === 'date' ? styles.active : ''}
                        onClick={() => handleButtonClick('date')}
                    >
                        Дата
                    </button>
                    <button 
                        className={activeButton === 'folders' ? styles.active : ''}
                        onClick={() => handleButtonClick('folders')}
                    >
                        Папки
                    </button>
                </div>
                <ul className={styles.sortedList}>
                    {sortedContent.type === 'dates' ? (
                        (() => {
                            const { groupedFiles, sortedDateKeys } = sortedContent.data as { 
                                groupedFiles: Record<string, File[]>, 
                                sortedDateKeys: string[] 
                            };
                            return sortedDateKeys.map(date => (
                                <DateGroup 
                                    key={date} 
                                    date={date} 
                                    files={groupedFiles[date]}
                                    onFileClick={onFileSelect}
                                />
                            ));
                        })()
                    ) : (
                        (sortedContent.data as Folder[]).map(folder => (
                            <SidebarListItem 
                                key={folder.id} 
                                folder={folder} 
                                onClick={handleFolderSelect}
                                isSelected={selectedFolderId === folder.id}
                                onFileClick={onFileSelect}
                            />
                        ))
                    )}                            
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;
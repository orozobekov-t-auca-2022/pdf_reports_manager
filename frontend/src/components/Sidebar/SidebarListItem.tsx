import styles from './Sidebar.module.css';
import type { Folder } from "../../types";
import { sortByDate } from "../../utils/dateUtils";

type Props = { 
    folder: Folder;
    onClick?: (folder: Folder) => void;
    isSelected?: boolean;
    onFileClick?: (fileId: number) => void;
}

function SidebarListItem({folder, onClick, isSelected = false, onFileClick} : Props){
    const sortedFiles = folder.files ? sortByDate(folder.files, 'desc') : [];

    return(
        <li>
            <div 
                className={`${styles.folderHeader} ${isSelected ? styles.selected : ''}`}
                onClick={() => onClick && onClick(folder)}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
            >
                <h4>{folder.name}</h4>
                {isSelected && <span className={styles.selectedIcon}>✓</span>}
            </div>
            <ul className={styles.filesList}>
                {sortedFiles.map(file => (
                    <li 
                        key={file.id} 
                        onClick={() => onFileClick && onFileClick(file.id)}
                        style={{ cursor: onFileClick ? 'pointer' : 'default' }}
                        className={styles.fileItem}
                    >
                        <span>{file.name}</span>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default SidebarListItem;
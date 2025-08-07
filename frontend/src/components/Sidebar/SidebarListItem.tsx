import styles from './Sidebar.module.css';
import type { Folder } from "../../types";
import { sortByDate } from "../../utils/dateUtils";

type Props = { 
    folder: Folder;
}

function SidebarListItem({folder} : Props){
    // Сортируем файлы внутри папки по дате создания (новые сначала)
    const sortedFiles = folder.files ? sortByDate(folder.files, 'desc') : [];

    return(
        <li>
            <div className={styles.folderHeader}>
                <h4>{folder.name}</h4>
            </div>
            <ul className={styles.filesList}>
                {sortedFiles.map(file => (
                    <li key={file.id}>
                        <span>{file.name}</span>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default SidebarListItem;
import styles from './FileListItem.module.css';
import type { File } from "../../../types";

type Props = { 
    file: File;
    onFileClick?: (fileId: number) => void;
}

function FileListItem({ file, onFileClick }: Props) {
    return (
        <li 
            className={styles.fileItem}
            onClick={() => onFileClick && onFileClick(file.id)}
            style={{ cursor: onFileClick ? 'pointer' : 'default' }}
        >
            <span className={styles.name}>{file.name}</span>
        </li>
    );
}

export default FileListItem;

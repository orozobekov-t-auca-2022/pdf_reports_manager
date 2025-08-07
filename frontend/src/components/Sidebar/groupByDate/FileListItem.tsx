import styles from './FileListItem.module.css';
import type { File } from "../../../types";

type Props = { 
    file: File;
}

function FileListItem({ file }: Props) {
    return (
        <li className={styles.fileItem}>
            <span className={styles.name}>{file.name}</span>
        </li>
    );
}

export default FileListItem;

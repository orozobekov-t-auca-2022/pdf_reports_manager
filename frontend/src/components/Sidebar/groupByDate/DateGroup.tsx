import styles from './DateGroup.module.css';
import type { File } from '../../../types';
import FileListItem from './FileListItem';

interface DateGroupProps {
    date: string;
    files: File[];
    onFileClick?: (fileId: number) => void;
}

function DateGroup({ date, files, onFileClick }: DateGroupProps) {
    return (
        <div className={styles.dateGroup}>
            <div className={styles.headerBlock}>
                <h4 className={styles.dateHeader}>{date}</h4>
            </div>
            <div className={styles.filesList}>
                {files.map(file => (
                    <FileListItem key={file.id} file={file} onFileClick={onFileClick} />
                ))}
            </div>
        </div>
    );
}

export default DateGroup;

import styles from './DateGroup.module.css';
import type { File } from '../../../types';
import FileListItem from './FileListItem';

interface DateGroupProps {
    date: string;
    files: File[];
}

function DateGroup({ date, files }: DateGroupProps) {
    return (
        <div className={styles.dateGroup}>
            <div className={styles.headerBlock}>
                <h4 className={styles.dateHeader}>{date}</h4>
            </div>
            <div className={styles.filesList}>
                {files.map(file => (
                    <FileListItem key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
}

export default DateGroup;

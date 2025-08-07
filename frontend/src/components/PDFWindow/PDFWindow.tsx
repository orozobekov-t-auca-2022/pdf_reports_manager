import { useEffect, useState } from "react";
import styles from './PDFWindow.module.css'

interface PDFWindowProps {
    selectedFileId?: number;
}

function PDFWindow({ selectedFileId }: PDFWindowProps) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileExists, setFileExists] = useState<boolean>(true);


    useEffect(() => {
        console.log(selectedFileId);
        
        if (selectedFileId) {
            setLoading(true);
            setError(null);
            setFileExists(true);

            fetch(`http://localhost:5000/api/files/${selectedFileId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setFileName(data.data.name);

                        const isDataExists = !data.data.filePath.includes('/mock/');

                        if(isDataExists) {
                            setFileUrl(`http://localhost:5000/api/files/${selectedFileId}/view`);
                            setFileExists(true);
                        } else{
                            setFileExists(false);
                            setError('Это моковые данные. Посмотрите другие файлы или создайте свой.')
                        }
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching file:', err);
                    setError('Ошибка при загрузке данных');
                    setLoading(false);
                });
        } else {
            setFileUrl(null);
            setFileName('');
            setError(null);
            setFileExists(true);
            setLoading(false);
        }
    }, [selectedFileId]);

    if (loading) {
        return (<div className={styles.loading}>Загрузка файла...</div>);
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h3 className={styles.fileName}>{fileName}</h3>
                <p>{error}</p>
                {!fileExists && (
                    <p className={styles.hint}>
                        💡 Подсказка: Для создания файла выберите папку и используйте кнопку "Загрузить файл"
                    </p>
                )}
            </div>
        );
    }

    if (!fileUrl) {
        return (<div className={styles.file}>Выберите файл для просмотра</div>);
    }

    return (
        <div style={{boxSizing: 'border-box', padding: '20px'}}>
            <h3 className={styles.fileName}>{fileName}</h3>
            <object data={fileUrl} className={styles.pdfObject}>
                <p>Не удается отобразить PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer">Открыть в новой вкладке</a></p>
            </object>
        </div>
    );
}

export default PDFWindow;
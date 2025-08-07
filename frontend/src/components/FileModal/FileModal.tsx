import { useState } from 'react';
import styles from './FileModal.module.css';

interface FileModalProps {
    onClose: () => void;
    onUpload: (file: File, folderId?: number) => void;
    folderId?: number;
}

function FileModal({ onClose, onUpload, folderId }: FileModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return 'Размер файла не должен превышать 10MB';
        }
        return null;
    };

    const isValid = selectedFile !== null && error === null;

    const handleUpload = async () => {
        if (!selectedFile || !isValid) {
            setError('Выберите корректный файл');
            return;
        }

        setIsUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            let uploadUrl = 'http://localhost:5000/api/files/upload';
            if (folderId) {
                uploadUrl += `?folderId=${folderId}`;
            }

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                onUpload(selectedFile, folderId);
                setSelectedFile(null);
                setError(null);
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Failed to upload file:', errorData);
                setError(`Ошибка загрузки: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Ошибка при загрузке файла');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                setSelectedFile(null);
            } else {
                setSelectedFile(file);
                setError(null);
            }
        } else {
            setSelectedFile(null);
            setError(null);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        onClose();
    };

    return(
        <div className={styles.modalContainer} onClick={onClose}>
            <form 
                className={styles.folderModal} 
                onClick={(e) => e.stopPropagation()} 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}
            >
                <h3 className={styles.modalTitle}>Загрузите файл с расширением PDF</h3>
                
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="fileInput">
                        Выберите PDF файл
                    </label>
                    <input 
                        id="fileInput"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className={styles.input}
                    />
                    {selectedFile && (
                        <p className={styles.fileName}>
                            Выбран файл: {selectedFile.name}
                        </p>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <div className={styles.buttonGroup}>
                    <button 
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={handleCancel}
                        type="button"
                    >
                        Отмена
                    </button>
                    <button 
                        className={`${styles.button} ${styles.createButton}`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpload();
                        }}
                        disabled={!isValid || isUploading}
                        type='submit'
                    >
                        {isUploading ? 'Загружается...' : 'Загрузить'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FileModal
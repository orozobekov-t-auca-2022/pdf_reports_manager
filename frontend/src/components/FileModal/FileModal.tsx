import { useState } from 'react';
import styles from './FolderModal.module.css';

interface FileModalProps {
    onClose: () => void;
    onCreate: (folderName: string) => void;
}

function FileModal({ onClose, onCreate }: FileModalProps) {
    const [folderName, setFolderName] = useState('');

    const handleCreate = async () => {
        if (folderName.trim()) {
            try {
                const response = await fetch('http://localhost:5000/api/folders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: folderName.trim() }),
                });

                if (response.ok) {
                    onCreate(folderName.trim());
                    setFolderName('');
                } else {
                    console.error('Failed to create folder');
                }
            } catch (error) {
                console.error('Error creating folder:', error);
            }
        }
    };

    const handleCancel = () => {
        setFolderName('');
        onClose();
    };

    return(
        <div className={styles.modalContainer} onClick={onClose}>
            <form 
                className={styles.folderModal} 
                onClick={(e) => e.stopPropagation()} 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                }}
            >
                <h3 className={styles.modalTitle}>Создать новую папку</h3>
                
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="folderName">
                        Имя папки
                    </label>
                    <input 
                        id="folderName"
                        type="text" 
                        className={styles.input}
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Введите имя папки"
                        autoFocus
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button 
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={handleCancel}
                    >
                        Отмена
                    </button>
                    <button 
                        className={`${styles.button} ${styles.createButton}`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleCreate();
                        }}
                        disabled={!folderName.trim()}
                        type='submit'
                    >
                        Создать
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FileModal
import { useState } from 'react';
import styles from './FolderModal.module.css';

interface FolderModalProps {
    onClose: () => void;
    onCreate: (folderName: string) => Promise<void>;
}

function FolderModal({ onClose, onCreate }: FolderModalProps) {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const isValid = folderName.trim().length >= 2 && folderName.trim().length <= 30 && !/[<>:"/\\|?*]/.test(folderName.trim());

    const handleCreate = async () => {
        const trimmedName = folderName.trim();
        if (!trimmedName) {
            setError('Имя папки не может быть пустым');
            return;
        }

        if (trimmedName.length < 1) {
            setError('Имя папки должно содержать минимум 1 символ');
            return;
        }

        if (trimmedName.length > 30) {
            setError('Имя папки не должно превышать 30 символов');
            return;
        }

        // Проверка на недопустимые символы
        const invalidChars = /[<>:"/\\|?*]/;
        if (invalidChars.test(trimmedName)) {
            setError('Имя папки содержит недопустимые символы');
            return;
        }

        setIsCreating(true);
        setError(null);
        
        try {
            await onCreate(trimmedName);
            setFolderName('');
        } catch (error: unknown) {
            console.error('Error creating folder:', error);
            setError(error instanceof Error ? error.message : 'Ошибка при создании папки');
        } finally {
            setIsCreating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFolderName(value);
        
        if (value.trim().length === 0) {
            setError('Имя папки не может быть пустым');
        } else {
            setError(null);
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
                        onChange={handleInputChange}
                        placeholder="Введите имя папки"
                        autoFocus
                        
                    />
                    {error && <p className={styles.error}>{error}</p>}
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
                        disabled={!isValid || isCreating}
                        type='submit'
                    >
                        {isCreating ? 'Создается...' : 'Создать'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FolderModal
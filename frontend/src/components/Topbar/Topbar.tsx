import { useState } from 'react';
import styles from './Topbar.module.css';
import FolderModal from '../FolderModal/FolderModal';
import FileModal from '../FileModal/FileModal';

interface TopbarProps {
    onFolderCreated?: () => void;
    onFileUploaded?: () => void;
    currentFolderId?: number;
}

function Topbar({ onFolderCreated, onFileUploaded, currentFolderId }: TopbarProps) {
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    
    function openFolderModal(e: React.MouseEvent) {
        e.preventDefault();
        setIsFolderModalOpen(true);
    }

    function openFileModal(e: React.MouseEvent) {
        e.preventDefault();
        setIsFileModalOpen(true);
    }

    function closeFolderModal() {
        setIsFolderModalOpen(false);
    }

    function closeFileModal() {
        setIsFileModalOpen(false);
    }

    async function handleFolderCreate(folderName: string) {
        console.log('Creating folder:', folderName);
        try {
            const response = await fetch('http://localhost:5000/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: folderName }),
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                console.log('Folder created successfully, closing modal and triggering refresh');
                closeFolderModal();
                if (onFolderCreated) {
                    onFolderCreated();
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to create folder:', errorData);
                throw new Error(errorData.message || 'Ошибка при создании папки');
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    }

    function handleFileUpload(file: File, folderId?: number) {
        console.log('File uploaded:', file.name, 'to folder:', folderId);
        closeFileModal();
        if (onFileUploaded) {
            onFileUploaded();
        }
    }

    return (
        <div className={styles.topbar}>
            <h4>
                {currentFolderId 
                    ? `Загрузка в папку (ID: ${currentFolderId})` 
                    : 'Выберите папку для загрузки файла'
                }
            </h4>
            <div className={styles.buttonGroup}>
                <button onClick={(e) => openFolderModal(e)}>Добавить папку</button>
                <button className={styles.uploadButton} onClick={(e) => openFileModal(e)} disabled={!currentFolderId}>
                    Загрузить файл
                </button>
            </div>
            
            {isFolderModalOpen && (
                <FolderModal onClose={closeFolderModal} onCreate={handleFolderCreate}/>
            )}
            
            {isFileModalOpen && (
                <FileModal 
                    onClose={closeFileModal} 
                    onUpload={handleFileUpload}
                    folderId={currentFolderId}
                />
            )}
        </div>
    );
}

export default Topbar;
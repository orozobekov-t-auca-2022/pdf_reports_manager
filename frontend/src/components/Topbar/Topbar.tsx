import { useState } from 'react';
import styles from './Topbar.module.css';
import FolderModal from '../FolderModal/FolderModal';

interface TopbarProps {
    onFolderCreated?: () => void;
}

function Topbar({ onFolderCreated }: TopbarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    function openModal(e: React.MouseEvent) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleFolderCreate(_folderName: string) {
        closeModal();
        if (onFolderCreated) {
            onFolderCreated();
        }
    }

    return (
        <div className={styles.topbar}>
            <h4>FileName.pdf</h4>
            <button onClick={(e) => openModal(e)}>Добавить папку</button>
            {
                (isModalOpen) ? 
                (
                    <FolderModal onClose={closeModal} onCreate={handleFolderCreate}/>
                ) : (
                    <></>
                )
            }
        </div>
    );
}

export default Topbar;
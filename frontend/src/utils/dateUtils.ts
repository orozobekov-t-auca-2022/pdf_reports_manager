export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return 'Некорректная дата';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

export const parseFormattedDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

export const sortByDate = <T extends { createdAt: string }>(
    items: T[], 
    order: 'asc' | 'desc' = 'desc'
): T[] => {
    return [...items].sort((a, b) => {
        const dateA = parseFormattedDate(a.createdAt);
        const dateB = parseFormattedDate(b.createdAt);
        
        if (order === 'asc') {
            return dateA.getTime() - dateB.getTime();
        } else {
            return dateB.getTime() - dateA.getTime();
        }
    });
};

export const groupFilesByDate = <T extends { createdAt: string }>(
    files: T[]
): Record<string, T[]> => {
    const grouped: Record<string, T[]> = {};
    
    files.forEach(file => {
        const dateKey = file.createdAt;
        
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(file);
    });
    
    Object.keys(grouped).forEach(dateKey => {
        grouped[dateKey] = sortByDate(grouped[dateKey], 'desc');
    });
    
    return grouped;
};


export const getSortedDateKeys = (groupedFiles: Record<string, unknown[]>): string[] => {
    return Object.keys(groupedFiles).sort((a, b) => {
        const dateA = parseFormattedDate(a);
        const dateB = parseFormattedDate(b);
        return dateB.getTime() - dateA.getTime();
    });
};

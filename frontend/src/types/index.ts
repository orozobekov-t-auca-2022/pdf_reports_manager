export interface File {
    id: number;
    name: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    createdAt: string;
    folderId: number;
    folder?: {
        id: number;
        name: string;
        createdAt: string;
    };
}

export interface Folder {
    id: number;
    name: string;
    createdAt: string;
    files?: File[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

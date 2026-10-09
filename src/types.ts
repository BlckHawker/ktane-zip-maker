export interface RepositoryFile {
    // relative path from repository root
    path: string
}

export interface SearchResult {
    file: RepositoryFile;
    score: number;
}

export interface RepoPathGetterProps {
    setRepoDirectory: React.Dispatch<React.SetStateAction<FileSystemDirectoryHandle|null>>
}

// Extend the browser's Window interface with the File System Access API.
declare global {
    interface Window {
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    }
}
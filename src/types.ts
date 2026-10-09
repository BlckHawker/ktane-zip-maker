export interface RepositoryFile {
    // relative path from repository root
    path: string
}

export interface SearchResult {
    file: RepositoryFile;
    score: number;
}

export interface RepoPathGetterProps {
    setRepoPath: React.Dispatch<React.SetStateAction<string|null>>
}
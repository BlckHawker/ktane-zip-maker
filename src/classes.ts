import Fuse from "fuse.js"
import type { RepositoryFile, SearchResult } from "./types"

export class FileSearch {
    private fuse: Fuse<RepositoryFile>;

    constructor(files: RepositoryFile[]) {
        this.fuse = new Fuse(files, {
            keys: [
                {name: "path", weight: 1}
            ],
            threshold: 0.35,
            ignoreLocation: true,
            includeScore: true,
        })
    }

    search(query: string, limit = 100): SearchResult[] {
        const normalizeQuery = query.trim();

        if(!normalizeQuery) {
            return [];
        }

        return this.fuse
        .search(normalizeQuery, {limit})
        .map(result => ({
            file: result.item,
            score: result.score ?? 1,
        }));
    }
}
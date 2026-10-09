import Fuse from "fuse.js"
import type { RepositoryFile, SearchResult } from "./types"

//Searches paths using fuzzy matching.
export class FileSearch {
    private fuse: Fuse<RepositoryFile>;

    //Create one instance per scanned repository, then reuse it for
    // subsequent queries instead of rebuilding the search index each time.
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

    /**
     * Returns the best fuzzy matches for a query.
     *
     * @param query - search text.
     * @param limit - Maximum number of results; defaults to 100.
     */
    search(query: string, limit: number): SearchResult[] {
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
import { useState, useMemo } from "react";
import { FileSearch } from "../classes";
import { LintZipBuilderProps } from "../types";
export default function LintZipBuilder(props: LintZipBuilderProps) {
    const [query, setQuery] = useState<string>("");
    const [selectedPaths, setSelectedPaths] = useState<Set<string>>(() => new Set());
    const [resultLimit] = useState(100);

    //Change the search index looked through if file change
    const fileSearch = useMemo(
        () => new FileSearch(props.repoFiles),
        [props.repoFiles]
    );

    //Change the results only if query, or the search index changes
    const results = useMemo(
        () => fileSearch.search(query, resultLimit),
        [fileSearch, query, resultLimit]
    );

    // Files selected to be zipped
    const selectedFiles = useMemo(
        () => props.repoFiles.filter(file => selectedPaths.has(file.path)),
        [props.repoFiles, selectedPaths]
    );

    //Update if a file should be selected for zipping
    function updateSelection(filePath: string, selected: boolean) {
        setSelectedPaths(previous => {
            const next = new Set(previous);

            if (selected) {
                next.add(filePath);
            } else {
                next.delete(filePath);
            }

            return next;
        });
    }
    
    return (
        <div>
            {props.repoFiles.length === 0 ? (
                <p>
                    Select a valid repo directory before being able to select files.
                </p>
            ) : (
                <>
                    <label htmlFor="file-search">
                        Search repository files:
                    </label>
                    <input
                        id="file-search"
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Enter a filename or path"
                    />

                    <p>
                        Showing {results.length} results (maximum {resultLimit}).
                    </p>

                    <section>
                        <h2>Search Results</h2>

                        {query.trim() === "" ? (
                            <p>Enter a search term to find files.</p>
                        ) : results.length === 0 ? (
                            <p>No matching files found.</p>
                        ) : (
                            results.map(({ file }) => (
                                <div key={file.path}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedPaths.has(file.path)}
                                            onChange={event =>
                                                updateSelection(
                                                    file.path,
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        {file.path}
                                    </label>
                                </div>
                            ))
                        )}
                    </section>

                    <hr />

                    <section>
                        <h2>Selected Files ({selectedFiles.length})</h2>

                        {selectedFiles.length === 0 ? (
                            <p>No files selected.</p>
                        ) : (
                            <ul>
                                {selectedFiles.map(file => (
                                    <li key={file.path}>
                                        {file.path}{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateSelection(file.path, false)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="button"
                            disabled={selectedFiles.length === 0}
                            onClick={() => props.onCreateZip(selectedFiles)}
                        >
                            Create ZIP
                        </button>
                    </section>
                </>
            )}
        </div>
    );
}
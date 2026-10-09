import { useState } from "react";
import { RepoPathGetterProps } from "../types";
import fs from "node:fs/promises";
import path from "node:path"
import { error } from "node:console";
export default function RepoPathGetter(props: RepoPathGetterProps) {
    const directoryName = "KtaneContent";
    const [selectedDirectory, setSelectedDirectory] = useState<FileSystemDirectoryHandle | null>(null);
    const [warningText, setWarningText] = useState<string>("");
    async function selectRepoPath() {
        setWarningText("");
        try {
            const directoryHandle = await window.showDirectoryPicker();
            if (directoryHandle.name !== directoryName) {
                setDirectoryError(`Please select a directory named "${directoryName}".`)
                setSelectedDirectory(directoryHandle);
                return;
            }
            setWarningText("Repository found!");
            setSelectedDirectory(directoryHandle);
            props.setRepoDirectory(directoryHandle);
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                setWarningText("Directory selection cancelled.");
                return;
            }
            let errorText = error instanceof Error
                            ? error.message
                            : "Unable to access the selected directory."
            setDirectoryError(errorText)
        }
    }

    function setDirectoryError(errorText: string) {
        setWarningText(errorText);
        props.setRepoDirectory(null);
    }

    return (
        <div>
            <p>Select your KtaneContent repository directory:</p>

            <button type="button" onClick={selectRepoPath}>
                Choose Repository Folder
            </button>

            {selectedDirectory && (
                <p>Selected directory: {selectedDirectory.name}</p>
            )}

            <p role="status">{warningText}</p>
        </div>
    );
}
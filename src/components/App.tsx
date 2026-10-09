
import { useState, useEffect } from "react";
import RepoPathGetter from "./RepoPathGetter";
import FileSelector from "./LintZipBuilder";
import { RepositoryFile } from "../types";
import { scanRepository } from "../scanRepository";
export default function App() {
    const [repoDirectory, setRepoDirectory] = useState<FileSystemDirectoryHandle | null>(null);
    //Scanning all the files in the repo
    const [isScanning, setIsScanning] = useState(false);
    //Files from the repo
    const [repoFiles, setRepoFiles] = useState<RepositoryFile[]>([]);
    //Ellipse to show not hanging
    const [scanningDots, setScanningDots] = useState("");
    const ignoredDirectories = [".git", "hooks"]
    //load the file from the repo when the repoDirectory is changed
    useEffect(() => {
    let cancelled = false;

    async function loadFiles() {
        if (repoDirectory === null) {
            setRepoFiles([]);
            setIsScanning(false);
            return;
        }

        setIsScanning(true);
        setRepoFiles([]);

        try {
            const files = await scanRepository(repoDirectory, ignoredDirectories);

            if (!cancelled) {
                setRepoFiles(files);
            }
        } catch (error) {
            if (!cancelled) {
                console.error("Failed to scan repository:", error);
                setRepoFiles([]);
            }
        } finally {
            if (!cancelled) {
                setIsScanning(false);
            }
        }
    }

    void loadFiles();

        return () => {
            cancelled = true;
        };
    }, [repoDirectory]);

    //update the ellipse when scanning to show program not hanging
    useEffect(() => {
    if (!isScanning) {
        setScanningDots("");
        return;
    }

    const intervalId = window.setInterval(() => {
        setScanningDots(current =>
            current.length >= 3 ? "" : current + "."
        );
    }, 500);

    return () => {
        window.clearInterval(intervalId);
    };
}, [isScanning]);


    function onCreateZip(selectedFiles: RepositoryFile[]) {
        throw new Error("Function not implemented")
    }
    
    return (
        <main>
            <h1>KTANE ZIP Maker</h1>
            <RepoPathGetter setRepoDirectory={setRepoDirectory}/>
            {isScanning ? <p>Scanning repository{scanningDots}</p> :
            repoDirectory === null ? <p>Select a valid repository directory.</p> :
            repoFiles.length === 0 ? <p>No files found, or the repository could not be scanned.</p> :
            <FileSelector repoFiles={repoFiles} onCreateZip={onCreateZip}/>
            }
        </main>
    );

    
}
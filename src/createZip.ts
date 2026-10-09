import JSZip from "jszip";
import type { RepositoryFile } from "./types";

export async function createZip(repoDirectory: FileSystemDirectoryHandle, selectedFiles: RepositoryFile[], zipName: string): Promise<void> {
    // initialize js zip
    const jsZip = new JSZip();

    for(let file of selectedFiles) {
        //split each file name by /
        const splitPath = file.path.split("/");

        //Get th file name
        const fileName = splitPath.pop();

        if (!fileName) {
            throw new Error(`Invalid file path: ${file.path}`);
        }

        //Get to the file from the root
        let directory = repoDirectory;

        for(let directoryName of splitPath) {
            directory = await directory.getDirectoryHandle(directoryName);
        }

        //Locate the file from the root directory
        const fileHandle = await directory.getFileHandle(fileName);
        //Get the actual file
        const fileData = await fileHandle.getFile();
        //read the content of the file
        const contents = await fileData.arrayBuffer();

        // Use the original relative path to preserve ZIP structure
        jsZip.file(file.path, contents);
    } 

    // Generate the ZIP archive
    const zipBlob = await jsZip.generateAsync({ type: "blob" });

    //Download the zip
    const downloadURL = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = zipName;
    link.click();
    URL.revokeObjectURL(downloadURL);
}
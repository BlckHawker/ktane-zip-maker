
import type { RepositoryFile } from "./types";

export async function scanRepository(
    root: FileSystemDirectoryHandle,
    ignoredDirectoryNames: string[]
): Promise<RepositoryFile[]> {
    const files: RepositoryFile[] = [];

    // Scan entries and call scanDirectory for subdirectories.
    async function scanDirectory(
        directory: FileSystemDirectoryHandle,
        parentPath: string
    ): Promise<void> {
        for await (const entry of directory.values()) {
            // Skip directories that don't need to be included.
            if (entry.kind === "directory" && ignoredDirectoryNames.includes(entry.name)) 
            {
                continue;
            }

            const path = parentPath
                ? `${parentPath}/${entry.name}`
                : entry.name;

            if (entry.kind === "file") {
                files.push({ path });
            } else if (entry.kind === "directory") {
                await scanDirectory(
                    entry as FileSystemDirectoryHandle,
                    path
                );
            }
        }
    }

    await scanDirectory(root, "");
    return files;
}
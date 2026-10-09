import { createInterface } from 'readline/promises'; 
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs/promises";
import path from "node:path"

const directoryName = "KtaneContent";

async function main() {
    console.log("KTANE Lint Zip Maker\n");

    const repoPath = getRepoDirectoryPath();

    if(repoPath == null) {
        return;
    }

    

    

}

async function getRepoDirectoryPath(): Promise<string | null> {
    const repoPath = ""

    try {
        const fileStats = await fs.stat(repoPath);

        if (!fileStats.isDirectory()) {
            console.log("\nThat path is not a directory.");
        }
        else if (path.basename(repoPath) !== directoryName) {
            console.log(`\nThat path does not have the target name "${directoryName}".`);
        }
        else {
            console.log("\nRepository found!");
            return repoPath;
        }

    } catch {
        console.log("\nRepository not found.");
    }

    return null;
}

main();
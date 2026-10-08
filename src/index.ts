import { createInterface } from 'readline/promises'; 
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs/promises";
import path from "node:path"

const directoryName = "KtaneContent";
const rl = createInterface({ input, output });

async function main() {
    console.log("KTANE Lint Zip Maker\n");

    const repoPath = getRepoDirectoryPath();

    if(repoPath == null) {
        await rl.close();
        return;
    }

    

    

    await rl.close();
}

async function getRepoDirectoryPath(): Promise<string | null> {
    const repoPath = (await rl.question('Paste the path to the repo: ')).trim();

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
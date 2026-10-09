import { useState } from "react";
import { RepoPathGetterProps } from "../types";
import fs from "node:fs/promises";
import path from "node:path"
export default function RepoPathGetter(props: RepoPathGetterProps) {
    const directoryName = "KtaneContent";
    const [warningText, setWarningText] = useState<string>("");
    const [unsanitizedRepoPath, getUnsanitizedRepoPath] = useState<string>("")
        async function validateRepoPath(pathStr: string) {
        const sanitizedPath = pathStr.trim();
        try {
                const fileStats = await fs.stat(sanitizedPath);
                if (!fileStats.isDirectory()) {
                    setWarningText("\nThat path is not a directory.");
                }
                else if (path.basename(sanitizedPath) !== directoryName) {
                    setWarningText(`\nThat path does not have the target name "${directoryName}".`);
                }
                else {
                    setWarningText("\nRepository found!");
                    props.setRepoPath(sanitizedPath)
                }
        
            } catch (e: unknown) {
                let error = typeof e === "string" ? e.toUpperCase() : e instanceof Error ? e.message : 
                "Repository can't be found";
                setWarningText(error);
            }
    }

    return (
        <div>
            <p>Paste the path to the repo:</p>
            <input type="text" onChange={(e) => getUnsanitizedRepoPath(e.target.value)}  />
            <input type="button" value="Submit" onClick={() => validateRepoPath(unsanitizedRepoPath)} />
            <p>{warningText}</p>
        </div>
    );


}
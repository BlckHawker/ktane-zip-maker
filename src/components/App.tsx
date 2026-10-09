
import { SetStateAction, useState } from "react";
import RepoPathGetter from "./RepoPathGetter";
export default function App() {
    const [repoPath, setRepoPath] = useState<string|null>(null);
    return (
        <main>
            <h1>KTANE ZIP Maker</h1>
            <RepoPathGetter setRepoPath={setRepoPath}/>
        </main>
    );

    
}
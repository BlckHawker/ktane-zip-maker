
import { SetStateAction, useState } from "react";
import RepoPathGetter from "./RepoPathGetter";
export default function App() {
    const [repoDirectory, setRepoDirectory] = useState<FileSystemDirectoryHandle | null>(null);
    return (
        <main>
            <h1>KTANE ZIP Maker</h1>
            <RepoPathGetter setRepoDirectory={setRepoDirectory}/>
        </main>
    );

    
}
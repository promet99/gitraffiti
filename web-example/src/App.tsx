import LightningFS from "@isomorphic-git/lightning-fs";
import git, { PromiseFsClient } from "isomorphic-git";
import JSZip from "jszip";

const addToZip = async (zip: JSZip, path: string, fs: PromiseFsClient) => {
  const entries = await fs.promises.readdir(path);
  for (const entry of entries) {
    const fullPath = path === "/" ? `/${entry}` : `${path}/${entry}`;
    const stats = await fs.promises.stat(fullPath);

    if (stats.isDirectory()) {
      const dir = zip.folder(entry);
      if (dir) {
        await addToZip(dir, fullPath, fs);
      }
    } else {
      const content = await fs.promises.readFile(fullPath);
      zip.file(entry, content);
    }
  }
};

const makeZip = async (fs: PromiseFsClient, root: string) => {
  const zip = new JSZip();
  await addToZip(zip, root, fs);
  const content = await zip.generateAsync({ type: "blob" });
  return content;
};

const downloadFile = (content: Blob, filename: string) => {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

function App() {
  const onClick = async () => {
    // * Init
    const fs = new LightningFS("fs", { wipe: true });
    await git.init({ fs, dir: "/" });

    // * Commit
    await fs.promises.writeFile("/a.md", `# TEST`);
    await git.add({ fs, dir: "/", filepath: "a.md" });
    await git.commit({
      fs,
      dir: "/",
      author: {
        name: "Mr. Test",
        email: "mrtest@example.com",
      },
      message: "initial commit",
    });

    const commits = await git.log({
      fs,
      dir: "/",
      depth: 5,
    });

    console.log(commits);

    // * Create zip file with all contents
    const content = await makeZip(fs, "/");
    downloadFile(content, "repository.zip");
  };

  return (
    <>
      <div>
        <button className="btn btn-primary" onClick={onClick}>
          Download Repository
        </button>
      </div>
    </>
  );
}

export default App;

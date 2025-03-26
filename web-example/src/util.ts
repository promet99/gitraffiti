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

export const makeZip = async (fs: PromiseFsClient, root: string) => {
  const zip = new JSZip();
  await addToZip(zip, root, fs);
  const content = await zip.generateAsync({ type: "blob" });
  return content;
};

export const downloadFile = (content: Blob, filename: string) => {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const initRepo = async () => {
  const fs = new LightningFS("fs", { wipe: true });
  await git.init({ fs, dir: "/" });
  return fs;
};

export const commit = async (
  fs: PromiseFsClient,
  options: { name: string; email: string; message: string; timestamp: number }
) => {
  const root = "/";
  const file = "0.md";
  const { name, email, message, timestamp } = options;

  const entries = await fs.promises.readdir(root);
  if (!entries.includes(file)) {
    await fs.promises.writeFile(root + file, "0");
  } else {
    let content;
    try {
      content = await fs.promises.readFile(root + file, "utf8");
      await fs.promises.writeFile(root + file, content === "0" ? "1" : "0");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      await fs.promises.writeFile(root + file, "0");
    }
  }

  await git.add({ fs, dir: "/", filepath: "0.md" });
  await git.commit({
    fs,
    dir: "/",
    author: {
      name,
      email,
      timestamp,
    },
    committer: {
      name,
      email,
      timestamp, // Math.floor(Date.now() / 1000),
    },
    message,
  });
};

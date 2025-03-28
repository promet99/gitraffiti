import LightningFS from "@isomorphic-git/lightning-fs";
import git, { PromiseFsClient } from "isomorphic-git";
import JSZip from "jszip";
import http from "isomorphic-git/http/web";

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

export const downloadZip = async (
  fs: PromiseFsClient,
  filename: string = "repository.zip"
) => {
  const content = await makeZip(fs, "/");
  downloadFile(content, filename);
};

// TODO: Test this
// ? https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
export const pushRepo = async (
  fs: PromiseFsClient,
  repoUrl: string,
  ghToken: string,
  force: boolean
) =>
  await git.push({
    fs,
    dir: "/",
    url: repoUrl,
    ref: "master",
    http,
    force,
    corsProxy: "https://cors.isomorphic-git.org",
    onAuth: () => ({ username: ghToken }),
  });

export const initRepo = async () => {
  // TODO: add git pull option
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

export const formatDateToTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const defaultValue = {
  year: 2016,
  values: [
    0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
};

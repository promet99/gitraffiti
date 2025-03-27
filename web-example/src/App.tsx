import { useState } from "react";
import { downloadZip, initRepo, pushRepo } from "./util";
import { YearCommitBox } from "./components/ghbutton";
import {
  CommitArray,
  commitFromYearArray,
  createCommitArray,
  moveCommitArray,
} from "./date";

const ghToken = import.meta.env.VITE_GH_TOKEN;
const repoUrl = import.meta.env.VITE_REPO_URL;
const email = import.meta.env.VITE_EMAIL;

function App() {
  const onClick = async () => {
    const fs = await initRepo();

    const yearArray = createCommitArray(2014);
    // TODO: add values to yearArray here

    await commitFromYearArray(fs, yearArray, {
      name: "gitraffiti",
      email: email,
      message: ".",
    });

    // await downloadZip(fs, "repository.zip");
    const pushResult = await pushRepo(fs, repoUrl, ghToken, true);
    console.log(pushResult);
  };

  const year = 2020;
  const [commitArray, setCommitArray] = useState<CommitArray>(
    createCommitArray(year)
  );

  return (
    <>
      <div>
        <div className="flex flex-row gap-2">
          <fieldset className="fieldset">
            {/* // TODO: use this value */}
            <legend className="fieldset-legend">GitHub Token</legend>
            <input
              type="text"
              className="input"
              placeholder="github_pat_XXXXX"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">GitHub Repo Url</legend>
            <input
              type="text"
              className="input"
              placeholder="https://github.com/username/repo"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">GitHub Email</legend>
            <input
              type="text"
              className="input"
              placeholder="XXXX+GITHUB_ID@users.noreply.github.com"
            />
          </fieldset>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onClick}>
            Push to GitHub
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setCommitArray(moveCommitArray(commitArray, "left", 1));
            }}
          >
            Move Left
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setCommitArray(moveCommitArray(commitArray, "right", 1));
            }}
          >
            Move Right
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setCommitArray(moveCommitArray(commitArray, "up", 1));
            }}
          >
            Move Up
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setCommitArray(moveCommitArray(commitArray, "down", 1));
            }}
          >
            Move Down
          </button>
        </div>
        <div>
          <YearCommitBox
            year={year}
            count={commitArray.values}
            setCount={(idx, count) => {
              setCommitArray((p) => ({
                ...p,
                values: p.values.map((c, i) => (i === idx ? count : c)),
              }));
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;

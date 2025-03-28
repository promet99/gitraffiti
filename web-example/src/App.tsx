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

  const [year, setYear] = useState(2020);
  const [commitArray, setCommitArray] = useState<CommitArray>(
    createCommitArray(year)
  );
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="m-4">
      <div>
        <div className="text-3xl font-black">Git-Raffiti</div>
        <div>
          Draw your own graffiti on GitHub!
          <br />
          Make your contribution graph green
        </div>
        <div className="m-4 flex">
          <ul className="timeline timeline-vertical timeline-compact">
            <li className="flex">
              <div className="timeline-middle">
                <div className="rounded-full bg-white w-5 h-5 flex items-center justify-center text-black">
                  1
                </div>
              </div>
              <div className="timeline-end timeline-box">
                Copy Paste your GitHub Commit Email:
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    className="input input-sm w-[300px]"
                    placeholder="XXXX+GITHUB_ID@users.noreply.github.com"
                  />
                </div>
                <br />
                Use your github email, or paste this to terminal:
                <br />
                <kbd className="kbd">
                  {` git log -1 | grep Author | sed -E 's/.*<([^>]*)>.*/\\1/' `}
                </kbd>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle">
                <div className="rounded-full bg-white w-5 h-5 flex items-center justify-center text-black">
                  2
                </div>
              </div>
              <div className="timeline-end timeline-box">
                Choose Which Years to Draw On
                <br />
                <input
                  type="number"
                  placeholder="Choose Year"
                  className="input input-xs w-[150px]"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              </div>

              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle">
                <div className="rounded-full bg-white w-5 h-5 flex items-center justify-center text-black">
                  3
                </div>
              </div>
              <div className="timeline-end timeline-box">
                Draw on Graph! <br /> You can drag. Right click will erase
                commit
                <br />
                <div>
                  <div className="stats shadow">
                    <div
                      className="stat h-[120px]"
                      onClick={() => setIsEditing(true)}
                    >
                      <div className="stat-title">Github Commit for Year</div>
                      {isEditing ? (
                        <input
                          type="number"
                          placeholder="Choose Year"
                          className="input stat-value p-0 w-[150px]"
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                        />
                      ) : (
                        <div className="stat-value cursor-pointer">{year}</div>
                      )}
                      <div className="stat-desc">Click to Change Year!</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
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
                <div>
                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => {
                      setCommitArray(createCommitArray(year));
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => {
                      setCommitArray(moveCommitArray(commitArray, "left", 1));
                    }}
                  >
                    ←
                  </button>

                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => {
                      setCommitArray(moveCommitArray(commitArray, "right", 1));
                    }}
                  >
                    →
                  </button>

                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => {
                      setCommitArray(moveCommitArray(commitArray, "up", 1));
                    }}
                  >
                    ↑
                  </button>

                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => {
                      setCommitArray(moveCommitArray(commitArray, "down", 1));
                    }}
                  >
                    ↓
                  </button>
                </div>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle">
                <div className="rounded-full bg-white w-5 h-5 flex items-center justify-center text-black">
                  4
                </div>
              </div>
              <div className="timeline-end timeline-box">
                Download, or Push to Github right away!
                <br />
                <div className="">
                  <div className="m-4">
                    <button
                      className="btn btn-primary btn-success"
                      onClick={onClick}
                    >
                      Download git file
                    </button>
                  </div>
                  <div className="flex flex-row gap-2 m-4">
                    <button
                      className="btn btn-primary btn-success"
                      onClick={onClick}
                    >
                      Push to GitHub
                    </button>
                    <fieldset className="fieldset">
                      {/* // TODO: use this value */}
                      <legend className="fieldset-legend">GitHub Token</legend>
                      <input
                        type="text"
                        className="input input-sm"
                        placeholder="github_pat_XXXXX"
                      />
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        GitHub Repo Url
                      </legend>
                      <input
                        type="text"
                        className="input input-sm w-[250px]"
                        placeholder="https://github.com/username/repo"
                      />
                    </fieldset>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

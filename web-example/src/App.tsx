import { useEffect, useState } from "react";
import { downloadZip, initRepo, pushRepo } from "./util";
import { YearCommitBox } from "./components/ghButton";
import {
  CommitArray,
  commitFromYearArray,
  createCommitArray,
  moveCommitArray,
} from "./date";

function App() {
  const [email, setEmail] = useState(
    () => localStorage.getItem("gh_email") || ""
  );
  const [repoUrl, setRepoUrl] = useState(
    () => localStorage.getItem("gh_repo_url") || ""
  );
  const [ghToken, setGhToken] = useState(
    () => localStorage.getItem("gh_token") || ""
  );

  // const [fs, setFs] = useState<FS>();

  const [commitArray, setCommitArray] = useState<CommitArray>(() => {
    const commitArray = localStorage.getItem("commitArray");
    if (commitArray) {
      return JSON.parse(commitArray);
    }
    return createCommitArray(new Date().getFullYear());
  });
  useEffect(() => {
    // save to localStorage
    localStorage.setItem("commitArray", JSON.stringify(commitArray));
  }, [commitArray]);

  const initAndCommit = async () => {
    const newFs = await initRepo();

    await commitFromYearArray(newFs, commitArray, {
      name: "gitraffiti",
      email: email,
      message: ".",
    });

    // setFs(newFs);
    return newFs;
  };
  const [isEditing, setIsEditing] = useState(false);

  // Wrapper functions to handle both state and localStorage
  const handleEmailChange = (value: string) => {
    setEmail(value);
    localStorage.setItem("gh_email", value);
  };

  const handleRepoUrlChange = (value: string) => {
    setRepoUrl(value);
    localStorage.setItem("gh_repo_url", value);
  };

  const handleGhTokenChange = (value: string) => {
    setGhToken(value);
    localStorage.setItem("gh_token", value);
  };

  return (
    <div className="m-4">
      <div>
        <div className="text-3xl font-black">Git-Raffiti</div>
        <div>
          Draw stuff on GitHub Contribution Graph!
          <br />
          Make yourself look like a pro!
        </div>
        <div className="m-4 flex">
          <ul className="timeline timeline-vertical timeline-compact">
            <li className="flex">
              <div className="timeline-middle">
                <div className="rounded-full bg-white w-5 h-5 flex items-center justify-center text-black">
                  1
                </div>
              </div>
              <div className="timeline-end timeline-box ml-3">
                <div className="text-lg font-bold">
                  1. Input your GitHub Commit Email:
                </div>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    className="input input-sm w-[300px]"
                    placeholder="XXXX+GITHUB_ID@users.noreply.github.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
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
              <div className="timeline-end timeline-box ml-3">
                <div className="text-lg font-bold">
                  2. Choose Which Years to Draw On
                </div>
                <br />
                <input
                  type="number"
                  placeholder="Choose Year"
                  className="input input-xs w-[150px]"
                  value={commitArray.year}
                  onChange={(e) =>
                    setCommitArray((p) => ({
                      ...p,
                      year: Number(e.target.value),
                    }))
                  }
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
              <div className="timeline-end timeline-box ml-3">
                <div className="text-lg font-bold">3. Draw on Graph!</div>
                <br /> You can drag. Right click will erase commit
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
                          value={commitArray.year}
                          onChange={(e) =>
                            setCommitArray((p) => ({
                              ...p,
                              year: Number(e.target.value),
                            }))
                          }
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                        />
                      ) : (
                        <div className="stat-value cursor-pointer">
                          {commitArray.year}
                        </div>
                      )}
                      <div className="stat-desc">Click to Change Year!</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <YearCommitBox
                    year={commitArray.year}
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
                      setCommitArray(createCommitArray(commitArray.year));
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
              <div className="timeline-end timeline-box ml-3">
                <div className="text-lg font-bold">
                  4. Download, or Push to Github right away!
                </div>
                <br />
                <div className="">
                  <div className="m-4">
                    <button
                      className="btn btn-primary btn-success"
                      onClick={async () => {
                        const newFs = await initAndCommit();
                        downloadZip(newFs, "repository.zip");
                      }}
                    >
                      Download git file
                    </button>
                  </div>
                  <div className="flex flex-row gap-2 m-4">
                    <button
                      className="btn btn-primary btn-success"
                      onClick={async () => {
                        const newFs = await initAndCommit();
                        console.log({ repoUrl, ghToken });
                        const pushResult = await pushRepo(
                          newFs,
                          repoUrl,
                          ghToken,
                          true
                        );
                        console.log(pushResult);
                        console.log(pushResult.ok === true);
                        // TODO
                        window.alert("Pushed to GitHub!");
                      }}
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
                        value={ghToken}
                        onChange={(e) => handleGhTokenChange(e.target.value)}
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
                        value={repoUrl}
                        onChange={(e) => handleRepoUrlChange(e.target.value)}
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

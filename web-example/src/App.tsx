import { useState } from "react";
import { downloadZip, initRepo, pushRepo } from "./util";
import { GhButton, GhPlaceholder, YearCommitBox } from "./components/ghbutton";
import { commitFromYearArray, makeYearArray } from "./date";
import { format, getDay, getYear, setDayOfYear } from "date-fns";

const ghToken = import.meta.env.VITE_GH_TOKEN;
const repoUrl = import.meta.env.VITE_REPO_URL;
const email = import.meta.env.VITE_EMAIL;

function App() {
  const onClick = async () => {
    const fs = await initRepo();

    const yearArray = makeYearArray(2014);
    // TODO: add values to yearArray

    await commitFromYearArray(fs, yearArray, {
      name: "gitraffiti",
      email: email,
      message: ".",
    });

    // await downloadZip(fs, "repository.zip");
    const pushResult = await pushRepo(fs, repoUrl, ghToken, true);
    console.log(pushResult);
  };

  const year = 2011;
  const [count, setCount] = useState<number[]>(Array(366).fill(0));

  return (
    <>
      <div>
        <button className="btn btn-primary" onClick={onClick}>
          Download Repository
        </button>

        <div>
          <YearCommitBox
            year={year}
            count={count}
            setCount={(idx, count) => {
              setCount((p) => p.map((c, i) => (i === idx ? count : c)));
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;

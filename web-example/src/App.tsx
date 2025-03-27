import { useState } from "react";
import { downloadZip, initRepo, pushRepo } from "./util";
import { GhButton } from "./components/ghbutton";
import { commitFromYearArray, makeYearArray } from "./date";

const ghToken = "";
const repoUrl = "";
const email = "";

function App() {
  const onClick = async () => {
    const fs = await initRepo();

    const yearArray = makeYearArray(2014);
    // TODO: add values to yearArray

    await commitFromYearArray(fs, yearArray, {
      name: "gitraffiti",
      email: email,
      message: "gitraffiti",
    });

    // await downloadZip(fs, "repository.zip");
    const pushResult = await pushRepo(fs, repoUrl, ghToken, true);
    console.log(pushResult);
  };

  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <button className="btn btn-primary" onClick={onClick}>
          Download Repository
        </button>

        <div>
          <div className="grid grid-cols-52 gap-[5px] w-fit">
            {Array(52)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="grid grid-rows-7 gap-[5px]">
                  {Array(7)
                    .fill(0)
                    .map((_, j) => (
                      <GhButton key={j} count={count} setCount={setCount} />
                    ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

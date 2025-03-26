import { useState } from "react";
import { commit, downloadFile, initRepo, makeZip } from "./util";
import { GhButton } from "./components/ghbutton";

function App() {
  const onClick = async () => {
    const fs = await initRepo();
    await commit(fs, {
      name: "testing",
      email: "testing@example.com", // add github noreply email here
      message: "testing",
      timestamp: Date.now(),
    });

    const content = await makeZip(fs, "/");
    downloadFile(content, "repository.zip");
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

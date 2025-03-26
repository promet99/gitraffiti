import { commit, downloadFile, initRepo, makeZip } from "./util";

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

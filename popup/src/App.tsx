import "font-awesome/css/font-awesome.min.css";
import React, { useEffect } from "react";
import "./assets/scss/app.scss";
import logo from "./logo.svg";
import { getChrome, getCurrentTab } from "./utils/helper";
import { Extension } from "./utils/Extension";
import { ECommandId } from "./shared";
// console.log(getChrome()?.devtools?.inspectedWindow?.eval("chrome"));

// getChrome()?.action?.onClicked.addListener((tab) => {
//   console.log(tab);
//   tab?.id &&
//     getChrome()?.scripting?.executeScript({
//       func: function () {
//         console.log("Executing");
//       },
//       target: { tabId: tab.id },
//     });
// });

const $app: React.CSSProperties = {
  minWidth: "20rem",
};

function App() {
  useEffect(() => {
    console.log("popup mounted");

    Extension.executeCommand({ commandId: ECommandId.TEST_COMMAND });

    // debugger;
    // // @ts-ignore
    // chrome.runtime.sendMessage({ popupMounted: true });
    // // @ts-ignore
    // console.log(chrome);
  }, []);

  return (
    <div className="App" style={$app}>
      <iframe
        width="748"
        height="422"
        src="https://www.youtube.com/embed/HPZ6djSF_CI"
        title="KIA CARENS chiếc xe SUV có đối thủ toàn MPV | Xế Cưng Walkaround"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
      <iframe src="https://www.youtube.com" width="748" height="422"></iframe>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="container-fluid pop-up-container">
        <button
          className="btn btn-warning super-center"
          id="download-file-pdf"
          onClick={() => {}}
        >
          pdf
          <i className="fas fa-file-pdf"></i>
        </button>
        <button
          className="btn btn-primary super-center mt-2"
          id="download-file-docx"
          onClick={() => {}}
        >
          docx
          <i className="fas fa-file-word"></i>
        </button>
      </div>
    </div>
  );
}

export default App;

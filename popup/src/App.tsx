import React, { useEffect } from "react";
import logo from "./logo.svg";
import "font-awesome/css/font-awesome.min.css";
import "./assets/scss/app.scss";
import { downloadPdf } from "./tools/downloadPdf";
import { handleCopyCodeToClipboard } from "./tools/copyCodeToClipboard";
import { downloadWord } from "./tools/downloadWord";
import { getChrome, getCurrentTab } from "./utils/helper";
console.log(getChrome()?.devtools?.inspectedWindow?.eval("chrome"));
console.log("eval", eval("chrome"));

getChrome()?.action?.onClicked.addListener((tab) => {
  console.log(tab);
  tab?.id &&
    getChrome()?.scripting?.executeScript({
      func: function () {
        console.log("Executing");
      },
      target: { tabId: tab.id },
    });
});

const $app: React.CSSProperties = {
  minWidth: "20rem",
};

function App() {
  useEffect(() => {
    console.log("popup mounted");
    (async () => {
      const currentTab = await getCurrentTab();
      console.log("currentTab", currentTab);

      // currentTab?.id &&
      //   getChrome()?.scripting?.executeScript({
      //     func: function () {
      //       console.log("Executing");
      //     },
      //     target: { tabId: currentTab?.id },
      //   });
    })();

    handleCopyCodeToClipboard();
    // debugger;
    // // @ts-ignore
    // chrome.runtime.sendMessage({ popupMounted: true });
    // // @ts-ignore
    // console.log(chrome);
  }, []);

  return (
    <div className="App" style={$app}>
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
          onClick={() => {
            downloadPdf();
          }}
        >
          pdf
          <i className="fas fa-file-pdf"></i>
        </button>
        <button
          className="btn btn-primary super-center mt-2"
          id="download-file-docx"
          onClick={() => {
            downloadWord();
          }}
        >
          docx
          <i className="fas fa-file-word"></i>
        </button>
      </div>
    </div>
  );
}

export default App;

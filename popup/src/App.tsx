import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useRef } from "react";
import "./assets/scss/app.scss";
import logo from "./logo.svg";
import { getChrome, getCurrentTab } from "./utils/helper";
import { Extension } from "./utils/Extension";
import { ECommandId } from "./shared";
import { useInitialRootStore } from "@/shared/models";
import ConvertCssToTailwind from "./components/ConvertCssToTailwind/ConvertCssToTailwind";
import CodeEditor from "./components/Editor/CodeEditor";
import { editor } from "monaco-editor";
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

const $app: React.CSSProperties = {};

function App() {
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
  });

  const editor1Ref = useRef<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    console.log("popup mounted");

    Extension.executeCommand({ commandId: ECommandId.TEST_COMMAND });

    // debugger;
    // // @ts-ignore
    // chrome.runtime.sendMessage({ popupMounted: true });
    // // @ts-ignore
    // console.log(chrome);
  }, []);

  if (!rehydrated) {
    return null;
  }

  return (
    <div className="App" style={$app}>
      <ConvertCssToTailwind />
      <CodeEditor language="css" editorRef={editor1Ref} />
      {/* <CodeEditor language="css" /> */}

      <div className="container-fluid pop-up-container">
        <button
          className="btn btn-warning super-center"
          id="download-file-pdf"
          onClick={() => {
            console.log(editor1Ref.current?.getValue());
          }}
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

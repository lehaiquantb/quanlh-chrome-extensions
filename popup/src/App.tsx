import React, { useEffect, useRef } from "react";
import "./assets/scss/app.scss";
import logo from "./logo.svg";
import { getChrome, getCurrentTab } from "./utils/helper";
import { Extension } from "./utils/Extension";
import {
  ECommandId,
  createElementByText,
  storageChrome,
  storageLocal,
} from "./shared";
import { useInitialRootStore, useStores } from "@/shared/models";
import ConvertCssToTailwind from "./components/ConvertCssToTailwind/ConvertCssToTailwind";
import CodeEditor from "./components/Editor/CodeEditor";
import { editor } from "monaco-editor";
import { Button, Switch, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react-lite";
import { Tools } from "./components/Tools/Tools";
import { ImageViewer } from "./shared/components/ImageViewer/ImageViewer";
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

const SwaggerSetting = observer(() => {
  const {
    website: { swaggerTool },
  } = useStores();
  const { autoInitUI } = swaggerTool;
  console.log("autoInitUI", autoInitUI);

  const onChangeAutoUI = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    swaggerTool.setAutoInitUI(checked);
  };

  return (
    <div>
      <Switch
        defaultChecked={autoInitUI}
        // checked={autoInitUI}
        onChange={onChangeAutoUI}
        checkedChildren="Automatic UI"
      />
    </div>
  );
});

const Tab2 = () => {
  const editor1Ref = useRef<editor.IStandaloneCodeEditor>();

  return (
    <div>
      Tab2
      <ConvertCssToTailwind />
      <CodeEditor language="css" editorRef={editor1Ref} />
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
};

const CommonSetting = () => {
  const onResetStorage = async () => {
    await storageChrome.clear();
    await storageLocal.clear();
  };
  return (
    <div>
      <Button type="primary" danger onClick={onResetStorage}>
        Reset storage
      </Button>
    </div>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Swagger Setting`,
    children: <SwaggerSetting />,
  },
  {
    key: "2",
    label: `Tools`,
    children: <Tools />,
  },
  {
    key: "3",
    label: `Common Setting`,
    children: <CommonSetting />,
  },
];

function App() {
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
  });

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

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="App p-2" style={$app}>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <div
        style={{
          height: "200px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div>
          <ImageViewer
            imgElement={
              createElementByText(`
        <img src="https://media.techmaster.vn/api/static/brbgh4451coepbqoch60/gJqA6Sw-" alt="Quiz luyện thi chứng chỉ AWS chủ đề S3 (P1)" onerror="this.onerror=null;this.src='/resources/image/thumbnail.jpg'"
         style="height: 100%;
        left: 0;
        object-fit: cover;
        position: absolute;
        top: 0;
        width: 100%;"
    >
      `) as HTMLImageElement
            } 
          />
        </div>
      </div>
    </div>
  );
}

export default App;

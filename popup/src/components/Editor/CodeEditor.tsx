import React, {
  FC,
  ForwardRefExoticComponent,
  MutableRefObject,
  RefAttributes,
  forwardRef,
  useRef,
} from "react";
import Editor, { EditorProps, Monaco, loader } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { tailwindCssConverter } from "@/shared/services/convert-css-to-tailwindcss";
type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
type Props = {
  editorRef?: MutableRefObject<IStandaloneCodeEditor | undefined>;
} & EditorProps;

loader.config({ paths: { vs: import.meta.env.PROD ? "/popup/vs" : "/vs" } });

const CodeEditor: ForwardRefExoticComponent<
  Props & RefAttributes<IStandaloneCodeEditor>
> = forwardRef((props: Props, ref) => {
  const { editorRef, ...rest } = props;

  function handleEditorDidMount(editor: IStandaloneCodeEditor, monaco: Monaco) {
    if (editorRef) editorRef.current = editor;
  }

  const handleEditorChange = (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    if (value) {
      console.log(value);
      // debugger
      tailwindCssConverter.convertCss(value);
    }
    // console.log("here is the current model value:", value);
  };

  return (
    <div>
      <Editor
        height="55rem"
        defaultValue={`/* --- Start here --- */\n`}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        {...rest}
      />
    </div>
  );
});

CodeEditor.defaultProps = {};

export default CodeEditor;

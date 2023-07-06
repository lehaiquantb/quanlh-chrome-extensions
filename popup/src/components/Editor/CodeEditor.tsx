import React, { FC, MutableRefObject, useRef } from "react";
import Editor, { EditorProps, Monaco, loader } from "@monaco-editor/react";
import { editor } from "monaco-editor";
type Props = {
  ref?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
} & EditorProps;

loader.config({ paths: { vs: import.meta.env.PROD ? "/popup/vs" : "/vs" } });

const CodeEditor: FC<Props> = (props: Props) => {
  const { ref, ...rest } = props;
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
  }

  ref && editorRef.current && (ref.current = editorRef.current);

  const handleEditorChange = (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    console.log("here is the current model value:", value);
  };

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        {...rest}
      />
    </div>
  );
};

CodeEditor.defaultProps = {};

export default CodeEditor;

// @ts-nocheck
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { Editor, useMonaco } from "@monaco-editor/react";
import monico from "monaco-editor";

const Code = ({
  content,
  setContent,
  lang,
}: {
  content: string;
  setContent: (content: string) => void;
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorWillMount = (monaco) => {};

  return (
    <>
      <Editor
        height="80vh"
        language={lang}
        defaultValue="//your content is loading..."
        theme="vs-dark" // vs-dark
        options={{
          fontSize: 16,
          selectOnLineNumbers: true,
        }}
        value={content}
        onChange={setContent}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
    </>
  );
};

export default Code;

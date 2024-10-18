import { useEffect, useRef, useState } from "react";
import { TerminalComponent as Terminal } from "../components/term";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Tree from "../components/tree";
import Code from "../components/code";
import debounce from "../utils/debounce";
import findLanguage from "../utils/languages";

function useSocket(replId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`ws://localhost:3000?roomId=${replId}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [replId]);

  return socket;
}

const Edit = () => {
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  const [loaded, setLoaded] = useState(false);
  const socket = useSocket(replId);
  const [lang, setLang] = useState("javascript");
  const [fileContent, setFileContent] = useState(
    "//your content is loading..."
  );
  const [currentFile, setCurrentFile] = useState<string | undefined>(undefined);
  const [terminals, setTerminals] = useState([{ id: 1 }]); // State to manage terminal components

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setLoaded(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (currentFile) {
      socket?.emit("fetchContent", { path: currentFile }, (fileDat) => {
        setFileContent(fileDat);
      });
    }

    //update language variable
    const extension = currentFile?.slice(currentFile.lastIndexOf(".") + 1);
    // remove / at the end
    const fixedExtension = extension?.replace("/", "");
    if (fixedExtension) {
      setLang(findLanguage(fixedExtension));
    }
  }, [currentFile]);

  useEffect(() => {
    if (socket && currentFile) {
      socket.emit("updateContent", {
        path: currentFile,
        content: fileContent,
      });
      // debounce the update content
    }
  }, [fileContent]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="border-gray-800 border-2 mt-4">
        <div className="grid grid-cols-6 grid-rows-1">
          <div className="row-span-full">
            <Tree socket={socket} setCurrentFile={setCurrentFile} />
          </div>
          <div className="mt-4 col-span-3 row-span-full">
            <Code
              content={fileContent}
              setContent={setFileContent}
              lang={lang}
            />
          </div>
          <div className="col-span-2">
            {terminals.map((terminal) => (
              <Terminal key={terminal.id} socket={socket} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

function ab2str(buf: ArrayBuffer): string {
  return new TextDecoder("utf-8").decode(buf);
}

const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 70,
  theme: {
    background: "black",
  },
};

export const TerminalComponent = ({ socket }: { socket: Socket }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current || !socket) {
      return;
    }

    if (termInstance.current) {
      termInstance.current.dispose();
    }

    const term = new Terminal(OPTIONS_TERM);
    termInstance.current = term;
    term.open(terminalRef.current);

    const terminalHandler = ({ data }: { data: ArrayBuffer }) => {
      if (data instanceof ArrayBuffer) {
        term.write(ab2str(data));
      }
    };

    socket.emit("requestTerminal");
    socket.on("terminal", terminalHandler);

    term.onData((data) => {
      socket.emit("terminalData", { data });
    });

    socket.emit("terminalData", { data: "clear\n" });

    return () => {
      socket.off("terminal", terminalHandler);
      term.dispose();
      termInstance.current = null;
    };
  }, [socket]);

  return <div className="p-1 overflow-clip" ref={terminalRef}></div>;
};

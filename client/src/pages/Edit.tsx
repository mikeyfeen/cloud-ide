import { useEffect, useState } from "react";
import { TerminalComponent as Terminal } from "../components/term";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";

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

    const fileStructure = useState([]);
    const [currentFile, setCurrentFile] = useState(undefined);

    return (
        <>
            <div className=" flex m-0 size-16 w-full">
                <Terminal socket={socket} />
            </div>
        </>
    );
};

export default Edit;

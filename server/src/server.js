import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchDir, fetchFileContent, saveFile } from "./files.js";
import TermController from "./pseudoterm.js";
import path from "path";

const terminalManager = new TermController();

export function initWs(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
      
    io.on("connection", async (socket) => {
        // Auth checks should happen here
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        // Split the host by '.' and take the first part as replId
        const fsID = host?.split('.')[0];
    
        if (!fsID) {
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }

        socket.emit("loaded", {
            rootContent: await fetchDir("/workspace", "")
        });

        initHandlers(socket, fsID);
    });
}

function initHandlers(socket, fsID) {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("fetchDir", async (dir, callback) => {
        const dirPath = `/workspace/`;
        const contents = await fetchDir(dirPath, dir);
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }, callback) => {
        const fullPath = path.resolve(`/workspace/${filePath}`);

        try {
            const data = await fetchFileContent(fullPath);
            callback(data);
        }
        catch (e) {
            console.error(e);
            callback(null);
        }
    });

    socket.on("updateContent", async ({ path: filePath, content }) => {
        const fullPath = path.resolve(`/workspace/${filePath}`);
        try {
            await saveFile(fullPath, content);
        }
        catch (e) {
            console.error(e);
        }
        // add buffer
        // await saveToS3(`code/${replId}`, filePath, content);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.create(socket.id, fsID, (data, id) => {
            socket.emit('terminal', {
                data: Buffer.from(data,"utf-8")
            });
        });
    });
    
    socket.on("terminalData", async ({ data }) => {
        terminalManager.write(socket.id, data);
        // if (data == "\n"){
        //     socket.emit("updateTree", {
        //         rootContent: await fetchDir("/workspace", "")
        //     }
        //     )
        // }
    });

    // socket.on("insertFile", async ({ name, path }) => {
    //     const fullPath = path.resolve(`/workspace/${name}`)
    //     try {
    //         await saveFile(fullPath)
    //     }
    //     catch (e){
    //         console.log(e)
    //     }
    // })


}
import express from 'express';
import TermController from './pseudoterm.js';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';


const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const terminals = new TermController();

io.on('connection', async (socket) => {
  const filesID = socket.handshake.query.id;

  if (!filesID) {
    socket.disconnect();
    terminals.clear(socket.id);
    return;
  }

  termInit(socket, filesID); 
});

function termInit (socket, filesID) {
  socket.on('disconnect', data => {
    console.log('Client disconnected');
  });
    
  socket.on("requestTerminal", async () => {
    terminals.create(socket.id, filesID, (data, id) => {
      socket.emit('terminalData', {
        data: Buffer.from(data).toString('utf-8'),
      });
    });
  });

  socket.on("terminalData", async ({ data }) => {
      terminals.write(socket.id, data);
  });

}



server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
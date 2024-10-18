import express from 'express';
import TermController from './pseudoterm.js';
import http from 'http';
import {Server} from 'socket.io';
import { initWs } from './server.js';
import cors from 'cors';


const app = express();
app.use(cors());
const server = http.createServer(app);

initWs(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
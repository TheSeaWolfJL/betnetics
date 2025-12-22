import express from "express";

import { Server } from "socket.io";
import { createServer } from "node:http";

const PORT = 4000;
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
  },
});


const handleListening = () => console.log("server greetings");

io.on("connection", function (socket) {
  socketController(socket, io);
});

http.listen(PORT, handleListening);
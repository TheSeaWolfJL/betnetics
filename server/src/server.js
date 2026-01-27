import express from "express";

import { Server } from "socket.io";
import { createServer } from "node:http";
import socketController from "./socketController.js";

const PORT = 4000;
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
  },
});


const handleListening = () => console.log("server greetings");

io.on("connection", function (socket) {
  socketController(socket, io);
});

http.listen(PORT, handleListening);
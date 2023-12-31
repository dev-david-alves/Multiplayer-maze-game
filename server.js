import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import Maze from "./public/classes/maze.js";

let app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.static("public"));

let numRows = 20;
let numCols = 20;
let width = 30;
let maze = new Maze(numRows, numCols, width);
let goal = {
  i: numRows - 2,
  j: Math.floor(Math.random() * numCols),
};

let io = new Server(httpServer);

let playersPos = {};

io.sockets.on("connection", (socket) => {
  console.log("Nova conexão: " + socket.id);

  io.emit("maze", maze);
  io.emit("goal", goal);
  io.to(socket.id).emit("id", socket.id);

  socket.on("mazeUpdate", (matrix) => {
    if (matrix && matrix != maze.matrix) {
      io.emit("mazeUpdate", matrix);
      maze.matrix = matrix;
    }
  });

  socket.on("pMove", (data) => {
    playersPos[socket.id] = data;
    io.emit("pMove", playersPos);

    if (data.i == goal.i && data.j == goal.j) {
      socket.broadcast.emit("gameOver", true);
    }
  });

  socket.on("disconnect", () => {
    console.log("Desconectado: " + socket.id);
    delete playersPos[socket.id];
    io.emit("pMove", playersPos);
  });
});

const port = 3000;
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${port}`);
});
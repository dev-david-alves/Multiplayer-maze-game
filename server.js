import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import Maze from "./public/classes/maze.js";

let app = express();
app.use(cors());
app.use(express.static("public"));

let server = app.listen(3000);

let numRows = 20;
let numCols = 40;
let width = 30;
let maze = new Maze(numRows, numCols, width);
let goal = {
  i: numRows - 2,
  j: Math.floor(Math.random() * numCols),
};

let io = new Server(server);

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
    socket.broadcast.emit("pMove", data);
    if (data.i == goal.i && data.j == goal.j) {
      socket.broadcast.emit("gameOver", true);
    }
  });
});

console.log("Servidor rodando!");

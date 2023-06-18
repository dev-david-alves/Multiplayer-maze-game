import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import Maze from "./public/classes/maze.js";

let app = express();
app.use(cors());
app.use(express.static("public"));

let server = app.listen(3000);

let numRows = 15;
let numCols = 20;
let width = 30;
let maze = new Maze(numRows, numCols, width);
let goal = {
  x: [Math.floor(Math.random() * 20)],
  y: 13,
};

let io = new Server(server);

io.sockets.on("connection", (socket) => {
  console.log("Nova conexão: " + socket.id);
  io.emit("maze", maze);
  io.emit("goal", goal);
  io.to(socket.id).emit('id', io.engine.clientsCount);

  let playerColor = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  }

  io.to(socket.id).emit('color', playerColor);

  socket.on("mazeUpdate", (matrix) => {
    if (matrix && matrix != maze.matrix) {
      io.emit("mazeUpdate", matrix);
      maze.matrix = matrix;
    }
  });

  socket.on("pMove", (data) => {
    socket.broadcast.emit("pMove", data);
    if(data.i == goal.y && data.j == goal.x){
      goal.x = [Math.floor(Math.random() * 20)];
      socket.broadcast.emit("gameOver", true);
    }
  });
});

console.log("Servidor rodando!");

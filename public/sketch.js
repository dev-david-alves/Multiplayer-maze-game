let socket;
let maze;
let w = 30;
let player;
let otherPlayer;
let goal;
let gameOver = false;
let win = false;
let playerColor = {
  r: Math.floor(Math.random() * 255),
  g: Math.floor(Math.random() * 255),
  b: Math.floor(Math.random() * 255),
}

function setup() {
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Conectado ao servidor");
    player = new Player(Math.floor(Math.random() * 3), Math.floor(Math.random() * 20), playerColor, w, w * 0.7, 5, 5, undefined, socket);

    socket.on("maze", (data) => {
      maze = data;
      createCanvas(w * maze.numCols + 1, w * maze.numRows + 1);
      player.matrix = maze.matrix;
    });

    socket.on("mazeUpdate", (data) => {
      maze.matrix = data;
      player.matrix = maze.matrix;
    });
  });
  socket.on("pMove", drawPlayers);
  socket.on("goal", (data) => (goal = data));
  socket.on("gameOver", (data) => (gameOver = data));
  socket.on("id", (data) => player.id = data);
  socket.on("color", (data) => player.color = data);
}

function drawPlayers(data) {
  otherPlayer = data;
}

function drawOtherPlayer(data) {
  let y = data.i * data.wGrid + data.offsetY + data.w / 2;
  let x = data.j * data.wGrid + data.offsetX + data.w / 2;

  noStroke();
  fill(255, 100, 100);
  if (data.lastDirection == "r") arc(x, y, data.w, data.w, PI / 6, -PI / 6);
  else if (data.lastDirection == "l")
    arc(x, y, data.w, data.w, PI + PI / 6, PI - PI / 6);
  else if (data.lastDirection == "t")
    arc(x, y, data.w, data.w, -PI / 3, PI + PI / 3);
  else if (data.lastDirection == "b")
    arc(x, y, data.w, data.w, PI - PI / 3, PI / 3);
}

function keyPressed() {
  let pI = player.i;
  let pJ = player.j;

  if (!maze.matrix[pI][pJ]) return;

  if (keyCode === LEFT_ARROW) {
    player.move(0, -1);
    player.lastDirection = "l";
  } else if (keyCode === RIGHT_ARROW) {
    player.lastDirection = "r";
    player.move(0, 1);
  } else if (keyCode === UP_ARROW) {
    player.move(-1, 0);
    player.lastDirection = "t";
  } else if (keyCode === DOWN_ARROW) {
    player.move(1, 0);
    player.lastDirection = "b";
  } else if (key === "s") {
    maze.matrix = player.removeWall();
  } else if (key === "a") {
    maze.matrix = player.addWall();
  }
}

function drawPlayerInfor(player) {
  textSize(14);
  textStyle(BOLD);
  // Criar
  fill(255);
  text("Você ainda pode criar", 20, 20);
  fill(0, 255, 0);
  text(player.wallsToAdd, 195, 20);
  fill(255);
  text("paredes.", 210, 20);

  // Destruir
  fill(255);
  text("Você ainda pode destruir", 20, 40);
  fill(0, 255, 0);
  text(player.wallsToDestroy, 224, 40);
  fill(255);
  text("paredes.", 238, 40);
}

function draw() {
  background(27, 27, 27);
  if (maze && player.matrix) {
    player.draw();
    if (otherPlayer) drawOtherPlayer(otherPlayer);

    drawPlayerInfor(player);

    for (let i = 0; i < maze.numRows; i++) {
      for (let j = 0; j < maze.numCols; j++) {
        stroke(255);
        fill(0);
        if (maze.matrix[i][j].walls[0])
          line(
            maze.matrix[i][j].x,
            maze.matrix[i][j].y,
            maze.matrix[i][j].x,
            maze.matrix[i][j].y + maze.matrix[i][j].w
          );
        if (maze.matrix[i][j].walls[1])
          line(
            maze.matrix[i][j].x,
            maze.matrix[i][j].y,
            maze.matrix[i][j].x + w,
            maze.matrix[i][j].y
          );
        if (maze.matrix[i][j].walls[2])
          line(
            maze.matrix[i][j].x + w,
            maze.matrix[i][j].y,
            maze.matrix[i][j].x + w,
            maze.matrix[i][j].y + maze.matrix[i][j].w
          );
        if (maze.matrix[i][j].walls[3])
          line(
            maze.matrix[i][j].x,
            maze.matrix[i][j].y + w,
            maze.matrix[i][j].x + w,
            maze.matrix[i][j].y + w
          );
      }
    }
    noStroke();
    fill(0, 0, 255);
    rect(goal.x * w, goal.y * w, w, w);

    if (player.wallsToAdd == 0) {
      setTimeout(() => (player.wallsToAdd = 3), 1000);
    } else if (player.wallsToDestroy == 0) {
      setTimeout(() => (player.wallsToDestroy = 3), 1000);
    }

    if (gameOver) {
      textSize(40);
      textStyle(BOLD);
      fill(255, 0, 0);
      text("Você perdeu!", (w * maze.numCols) / 6, (w * maze.numRows) / 2);
      noLoop();
    } else if (player.j == goal.x && player.i == goal.y) {
      textSize(40);
      textStyle(BOLD);
      fill(0, 255, 0);
      text("Você venceu!", (w * maze.numCols) / 4, (w * maze.numRows) / 2);
      noLoop();
    }
  }
}

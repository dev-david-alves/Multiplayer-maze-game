let socket;
let maze;
let player;
let otherPlayer;
let goal;
let gameOver = false;
let win = false;

function setup() {
  socket = io.connect("http://localhost:3000");
  textFont("Arial");

  socket.on("connect", () => {
    console.log("Conectado ao servidor");
    player = new Player(
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 20),
      30,
      undefined,
      socket
    );

    socket.on("maze", (data) => {
      maze = data;
      createCanvas(maze.w * maze.numCols + 1, maze.w * maze.numRows + 1);

      player.matrix = maze.matrix;
      player.j = Math.floor(Math.random() * 20);
      player.w = maze.w;
    });

    socket.on("mazeUpdate", (data) => {
      maze.matrix = data;
      player.matrix = maze.matrix;
    });
  });
  socket.on("pMove", drawPlayers);
  socket.on("goal", (data) => (goal = data));
  socket.on("gameOver", (data) => (gameOver = data));
  socket.on("id", (data) => (player.id = data));
}

function drawPlayers(data) {
  otherPlayer = data;
}

function drawOtherPlayer(data) {
  let offset = data.wP / 2 + (data.wGrid - data.wP) / 2;
  let y = data.i * data.wGrid + offset;
  let x = data.j * data.wGrid + offset;

  noStroke();
  fill(255, 100, 0);
  if (data.lastDirection == "r") arc(x, y, data.wP, data.wP, PI / 6, -PI / 6);
  else if (data.lastDirection == "l")
    arc(x, y, data.wP, data.wP, PI + PI / 6, PI - PI / 6);
  else if (data.lastDirection == "t")
    arc(x, y, data.wP, data.wP, -PI / 3, PI + PI / 3);
  else if (data.lastDirection == "b")
    arc(x, y, data.wP, data.wP, PI - PI / 3, PI / 3);
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
  text(player.wallsToAdd, 170, 20);
  fill(255);
  text("paredes.", 185, 20);

  // Destruir
  fill(255);
  text("Você ainda pode destruir", 20, 40);
  fill(0, 255, 0);
  text(player.wallsToDestroy, 190, 40);
  fill(255);
  text("paredes.", 205, 40);
}

function draw() {
  background(27, 27, 27);
  if (maze && player.matrix) {
    player.draw();

    drawPlayerInfor(player);

    let playerView = 2;
    let cameraOffset = {
      x: {
        left: Math.max(player.j - playerView, 0),
        right: Math.min(player.j + playerView + 1, maze.numCols),
      },
      y: {
        top: Math.max(player.i - playerView, 0),
        bottom: Math.min(player.i + playerView + 1, maze.numRows),
      },
    };

    for (let i = cameraOffset.y.top; i < cameraOffset.y.bottom; i++) {
      for (let j = cameraOffset.x.left; j < cameraOffset.x.right; j++) {
        stroke(255);
        fill(0);
        if (maze.matrix[i][j].walls[0])
          line(
            maze.matrix[i][j].j * maze.w,
            maze.matrix[i][j].i * maze.w,
            maze.matrix[i][j].j * maze.w,
            maze.matrix[i][j].i * maze.w + maze.matrix[i][j].w
          );
        if (maze.matrix[i][j].walls[1])
          line(
            maze.matrix[i][j].j * maze.w,
            maze.matrix[i][j].i * maze.w,
            maze.matrix[i][j].j * maze.w + maze.w,
            maze.matrix[i][j].i * maze.w
          );
        if (maze.matrix[i][j].walls[2])
          line(
            maze.matrix[i][j].j * maze.w + maze.w,
            maze.matrix[i][j].i * maze.w,
            maze.matrix[i][j].j * maze.w + maze.w,
            maze.matrix[i][j].i * maze.w + maze.matrix[i][j].w
          );
        if (maze.matrix[i][j].walls[3])
          line(
            maze.matrix[i][j].j * maze.w,
            maze.matrix[i][j].i * maze.w + maze.w,
            maze.matrix[i][j].j * maze.w + maze.w,
            maze.matrix[i][j].i * maze.w + maze.w
          );
      }
    }

    if (otherPlayer) drawOtherPlayer(otherPlayer);

    noStroke();
    fill(0, 0, 255);
    rect(goal.j * maze.w + 5, goal.i * maze.w + 5, maze.w - 10, maze.w - 10);

    
    textSize(40);
    textStyle(BOLD);
    textFont("Arial");
    const centerX = width / 2;
    const centerY = height / 2;

    if (gameOver) {
      textAlign(CENTER, CENTER);
      fill(255, 0, 0);
      text(
        "Você perdeu!",
        centerX,
        centerY
      );
      noLoop();
    } else if (player.j == goal.j && player.i == goal.i) {
      textAlign(CENTER, CENTER);
      fill(0, 255, 0);
      text(
        "Você venceu!",
        centerX,
        centerY
      );
      noLoop();
    }

    noFill();
    strokeWeight(3);
    stroke(255);
    rect(0, 0, maze.w * maze.numCols, maze.w * maze.numRows);

    if (player.wallsToAdd == 0) {
      setTimeout(() => (player.wallsToAdd = 3), 1000);
    } else if (player.wallsToDestroy == 0) {
      setTimeout(() => (player.wallsToDestroy = 3), 1000);
    }
  }
}

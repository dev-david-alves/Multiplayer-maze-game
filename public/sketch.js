let socket;
let maze;
let player;
let otherPlayers;
let goal;
let gameOver = false;
let win = false;
let canvas;
function setup() {
  socket = io.connect("http://192.168.0.5:3000");
  textFont("Arial");

  socket.on("connect", () => {
    console.log("Conectado ao servidor");
    player = new Player(
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 20),
      30,
      undefined,
      socket,
      0
    );

    socket.on("maze", (data) => {
      maze = data;
      canvas = createCanvas(
        maze.w * maze.numCols + 1,
        maze.w * maze.numRows + 60
      );
      canvas.touchEnded(touchEndedTeste);
      canvas.touchMoved(touchMovedTeste);

      player.matrix = maze.matrix;
      player.j = Math.floor(Math.random() * 20);
      player.wGrid = maze.w;
      player.w = maze.w * 0.8;

      button = createButton("Adicionar");
      button.position(
        maze.w * (maze.matrix[0].length - 3),
        maze.w * maze.matrix.length + 20
      );
      button.mousePressed(addWall);

      button = createButton("Remover");
      button.position(
        maze.w * maze.matrix[0].length,
        maze.w * maze.matrix.length + 20
      );
      button.mousePressed(removeWall);
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

  setInterval(() => {
    if (player) player.wallsToAdd = 3;
  }, 10000);

  setInterval(() => {
    if (player) player.wallsToDestroy = 3;
  }, 20000);
}

function addWall() {
  maze.matrix = player.addWall();
}

function removeWall() {
  maze.matrix = player.removeWall();
}

let preMovimentX = 0;
let preMovimentY = 0;
let movimentX = 0;
let movimentY = 0;
let touchStartedNow = false;

function touchMovedTeste() {
  if (!touchStartedNow) {
    preMovimentX = mouseX;
    preMovimentY = mouseY;
    touchStartedNow = true;
  }
  movimentX = mouseX;
  movimentY = mouseY;
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function touchEndedTeste() {
  touchStartedNow = false;
  let pI = player.i;
  let pJ = player.j;

  movimentX = mouseX;
  movimentY = mouseY;

  if (!maze.matrix[pI][pJ]) return;

  let moveX = movimentX - preMovimentX;
  let moveY = movimentY - preMovimentY;

  if (moveX < 0 && Math.abs(moveX) >= 60) {
    if (player.lastDirection == "l") player.move(0, -1);
    else player.lastDirection = "l";
  } else if (moveX > 0 && Math.abs(moveX) >= 60) {
    if (player.lastDirection == "r") player.move(0, 1);
    else player.lastDirection = "r";
  } else if (moveY < 0 && Math.abs(moveY) >= 60) {
    if (player.lastDirection == "t") player.move(-1, 0);
    else player.lastDirection = "t";
  } else if (moveY > 0 && Math.abs(moveY) >= 60) {
    if (player.lastDirection == "b") player.move(1, 0);
    else player.lastDirection = "b";
  }

  preMovimentX = 0;
  preMovimentY = 0;
  movimentX = 0;
  movimentY = 0;
}

function drawPlayers(data) {
  otherPlayers = data;
}

function drawOtherPlayers(data) {
  if (!data) return;

  let colors = [
    { r: 0, g: 100, b: 255 },
    { r: 255, g: 0, b: 100 },
    { r: 255, g: 100, b: 0 },
    { r: 100, g: 0, b: 255 },
    { r: 100, g: 255, b: 0 },
    { r: 0, g: 255, b: 100 },
    { r: 0, g: 100, b: 255 },
    { r: 255, g: 0, b: 100 },
    { r: 255, g: 100, b: 0 },
  ];

  let index = 0;

  for (let id in data) {
    if (id == player.id) continue;
    let p = data[id];

    let offset = p.wP / 2 + (p.wGrid - p.wP) / 2;
    let y = p.i * p.wGrid + offset;
    let x = p.j * p.wGrid + offset;

    noStroke();
    fill(colors[index].r, colors[index].g, colors[index].b);
    if (p.lastDirection == "r") arc(x, y, p.wP, p.wP, PI / 6, -PI / 6);
    else if (p.lastDirection == "l")
      arc(x, y, p.wP, p.wP, PI + PI / 6, PI - PI / 6);
    else if (p.lastDirection == "t")
      arc(x, y, p.wP, p.wP, -PI / 3, PI + PI / 3);
    else if (p.lastDirection == "b") arc(x, y, p.wP, p.wP, PI - PI / 3, PI / 3);

    index++;
    if (index >= colors.length) index = 0;
  }
}

function keyPressed() {
  let pI = player.i;
  let pJ = player.j;

  if (!maze.matrix[pI][pJ]) return;

  if (keyCode === LEFT_ARROW) {
    if (player.lastDirection == "l") player.move(0, -1);
    else player.lastDirection = "l";
  } else if (keyCode === RIGHT_ARROW) {
    if (player.lastDirection == "r") player.move(0, 1);
    else player.lastDirection = "r";
  } else if (keyCode === UP_ARROW) {
    if (player.lastDirection == "t") player.move(-1, 0);
    else player.lastDirection = "t";
  } else if (keyCode === DOWN_ARROW) {
    if (player.lastDirection == "b") player.move(1, 0);
    else player.lastDirection = "b";
  } else if (key === "s") {
    maze.matrix = player.removeWall();
  } else if (key === "a") {
    maze.matrix = player.addWall();
  }
}

function drawPlayerInfor(player) {
  if (player.matrix) {
    textSize(14);
    textStyle(BOLD);
    // Criar
    fill(255);
    text("Você ainda pode criar", 0, player.wGrid * player.matrix.length + 20);
    if (player.wallsToAdd > 0) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 0);
    }
    text(player.wallsToAdd, 150, player.wGrid * player.matrix.length + 20);
    fill(255);
    text(
      "paredes. \t\t\t\t\t  Tecla (a)",
      162,
      player.wGrid * player.matrix.length + 20
    );

    // Destruir
    fill(255);
    text(
      "Você ainda pode destruir",
      0,
      player.wGrid * player.matrix.length + 40
    );
    if (player.wallsToDestroy > 0) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 0);
    }
    text(player.wallsToDestroy, 170, player.wGrid * player.matrix.length + 40);
    fill(255);
    text(
      "paredes. \t\t\t Tecla (s)",
      182,
      player.wGrid * player.matrix.length + 40
    );
  }
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

    if (otherPlayers) drawOtherPlayers(otherPlayers);

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
      text("Você perdeu!", centerX, centerY);
      noLoop();
    } else if (player.j == goal.j && player.i == goal.i) {
      textAlign(CENTER, CENTER);
      fill(0, 255, 0);
      text("Você venceu!", centerX, centerY);
      noLoop();
    }

    noFill();
    strokeWeight(3);
    stroke(255);
    rect(0, 0, maze.w * maze.numCols, maze.w * maze.numRows);
  }
}

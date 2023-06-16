let w = 30;
let numRows = 15;
let numCols = 20;
let matrix = [];
let stack = [];
let goal = {
  x: [2, 10, 18][Math.floor(Math.random() * 3)],
  y: 13,
};

let player = new Player(3, 3, w, w * 0.7, 5, 5);

function setup() {
  createCanvas(w * numCols + 1, w * numRows + 1);

  for (let i = 0; i < numRows; i++) {
    matrix.push([]);
    for (let j = 0; j < numCols; j++) {
      matrix[i].push(new Cell(i, j, w));
    }
  }

  createMaze(matrix);
}

function createMaze(matrix) {
  let locI = 0;
  let locJ = 0;
  stack.push([locI, locJ]);
  matrix[locI][locJ].visited = true;

  while (stack.length > 0) {
    let neighbors = matrix[locI][locJ].getNeighbors(
      locI,
      locJ,
      matrix,
      numRows,
      numCols
    );

    if (neighbors.length == 0) {
      newPos = stack.pop(0);
      locI = newPos[0];
      locJ = newPos[1];
      matrix[locI][locJ].visited = true;
    } else {
      let newPos = generateNewDirection(locI, locJ, neighbors);
      locI = newPos[0];
      locJ = newPos[1];
      stack.push([locI, locJ]);
      matrix[locI][locJ].visited = true;
    }
  }
}

function drawMaze() {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      matrix[i][j].draw();
    }
  }
}

function generateNewDirection(i, j, neighbors) {
  let index = parseInt(Math.random() * neighbors.length);
  let neighbor = neighbors[index];
  let neigI = neighbor[0];
  let neigJ = neighbor[1];

  if (neigI != i) {
    if (neigI < i) {
      matrix[i][j].walls[1] = false;
      matrix[neigI][neigJ].walls[3] = false;
    } else {
      matrix[i][j].walls[3] = false;
      matrix[neigI][neigJ].walls[1] = false;
    }
  } else if (neigJ != j) {
    if (neigJ < j) {
      matrix[i][j].walls[0] = false;
      matrix[neigI][neigJ].walls[2] = false;
    } else {
      matrix[i][j].walls[2] = false;
      matrix[neigI][neigJ].walls[0] = false;
    }
  }

  return [neigI, neigJ];
}

function keyPressed() {
  let pI = player.i;
  let pJ = player.j;

  if (!matrix[pI][pJ]) return;

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
    matrix = player.removeWall(matrix);
  } else if (key === "a") {
    matrix = player.addWall(matrix);
  }
}

function drawPlayerInfor() {
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
  fill(0, 0, 255);
  noStroke();
  rect(goal.x * w, goal.y * w, w, w);
  
  player.draw();
  drawPlayerInfor();
  drawMaze();


  if (player.wallsToAdd == 0) {
    setTimeout(() => (player.wallsToAdd = 3), 10000);
  } else if (player.wallsToDestroy == 0) {
    setTimeout(() => (player.wallsToDestroy = 3), 10000);
  }


  if (player.j == goal.x && player.i == goal.y) {
    textSize(40);
    textStyle(BOLD);
    fill(0, 255, 0);
    text("Jogador 1 ganhou!", (w * numCols) / 6, (w * numRows) / 2);
    noLoop();
  }
}

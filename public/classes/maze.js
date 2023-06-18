import Cell from "./cell.js";

export default class Maze {
  constructor(numRows, numCols, width) {
    this.matrix = [];
    this.numRows = numRows;
    this.numCols = numCols;
    this.w = width;

    for (let i = 0; i < numRows; i++) {
      this.matrix.push([]);
      for (let j = 0; j < numCols; j++) {
        this.matrix[i].push(new Cell(i, j, this.w));
      }
    }

    this.createMaze();
  }

  createMaze() {
    let locI = 0;
    let locJ = 0;
    let stack = [];
    stack.push([locI, locJ]);
    this.matrix[locI][locJ].visited = true;

    while (stack.length > 0) {
      let neighbors = this.matrix[locI][locJ].getNeighbors(
        locI,
        locJ,
        this.matrix,
        this.numRows,
        this.numCols
      );

      if (neighbors.length == 0) {
        let newPos = stack.pop(0);
        locI = newPos[0];
        locJ = newPos[1];
        this.matrix[locI][locJ].visited = true;
      } else {
        let newPos = this.generateNewDirection(locI, locJ, neighbors);
        locI = newPos[0];
        locJ = newPos[1];
        stack.push([locI, locJ]);
        this.matrix[locI][locJ].visited = true;
      }
    }
  }

  // drawMaze() {
  //   for (let i = 0; i < numRows; i++) {
  //     for (let j = 0; j < numCols; j++) {
  //       this.matrix[i][j].draw();
  //     }
  //   }
  // }

  generateNewDirection(i, j, neighbors) {
    let index = parseInt(Math.random() * neighbors.length);
    let neighbor = neighbors[index];
    let neigI = neighbor[0];
    let neigJ = neighbor[1];

    if (neigI != i) {
      if (neigI < i) {
        this.matrix[i][j].walls[1] = false;
        this.matrix[neigI][neigJ].walls[3] = false;
      } else {
        this.matrix[i][j].walls[3] = false;
        this.matrix[neigI][neigJ].walls[1] = false;
      }
    } else if (neigJ != j) {
      if (neigJ < j) {
        this.matrix[i][j].walls[0] = false;
        this.matrix[neigI][neigJ].walls[2] = false;
      } else {
        this.matrix[i][j].walls[2] = false;
        this.matrix[neigI][neigJ].walls[0] = false;
      }
    }

    return [neigI, neigJ];
  }
}

export default class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.visited = false;
    this.walls = [true, true, true, true];
  }

  getNeighbors(i, j, matrix, numRows, numCols) {
    let ii = [0, -1, 0, 1];
    let jj = [-1, 0, 1, 0];
    let neighbors = [];

    for (let k = 0; k < ii.length; k++) {
      let newI = i + ii[k];
      let newJ = j + jj[k];

      if (0 <= newI && newI < numRows && 0 <= newJ && newJ < numCols) {
        if (!matrix[newI][newJ].visited) neighbors.push([newI, newJ]);
      }
    }

    return neighbors;
  }
}

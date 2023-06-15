class Cell {
  constructor(i, j, w) {
    this.y = i * w;
    this.x = j * w;
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

  draw() {
    stroke(255);
    fill(0);
    if (this.walls[0]) line(this.x, this.y, this.x, this.y + this.w);
    if (this.walls[1]) line(this.x, this.y, this.x + w, this.y);
    if (this.walls[2]) line(this.x + w, this.y, this.x + w, this.y + this.w);
    if (this.walls[3]) line(this.x, this.y + w, this.x + w, this.y + w);
  }
}

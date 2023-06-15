class Player {
  constructor(i, j, wGrid, w, offsetX, offsetY) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.wGrid = wGrid;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.lastDirection = "r";
  }

  move(i, j) {
    if ((j < 0 && !matrix[this.i][this.j].walls[0]) || (j > 0 && !matrix[this.i][this.j].walls[2])) this.j += j;
    else if ((i < 0 && !matrix[this.i][this.j].walls[1]) || (i > 0 && !matrix[this.i][this.j].walls[3]))  this.i += i;
  }

  removeWall(matrix) {
    if (this.lastDirection == "r" && this.j + 1 < matrix[0].length) {
      matrix[this.i][this.j].walls[2] = false;
      matrix[this.i][this.j + 1].walls[0] = false;
    } else if (this.lastDirection == "l" && this.j - 1 >= 0) {
      matrix[this.i][this.j].walls[0] = false;
      matrix[this.i][this.j - 1].walls[2] = false;
    } else if (this.lastDirection == "b" && this.i + 1 < matrix[0].length) {
      matrix[this.i][this.j].walls[3] = false;
      matrix[this.i + 1][this.j].walls[1] = false;
    } else if (this.lastDirection == "t" && this.i - 1 >= 0) {
      matrix[this.i][this.j].walls[1] = false;
      matrix[this.i - 1][this.j].walls[3] = false;
    }

    return matrix;
  }

  addWall(matrix) {
    if (this.lastDirection == "r" && this.j + 1 < matrix[0].length) {
      matrix[this.i][this.j].walls[2] = true;
      matrix[this.i][this.j + 1].walls[0] = true;
    } else if (this.lastDirection == "l" && this.j - 1 >= 0) {
      matrix[this.i][this.j].walls[0] = true;
      matrix[this.i][this.j - 1].walls[2] = true;
    } else if (this.lastDirection == "b" && this.i + 1 < matrix[0].length) {
      matrix[this.i][this.j].walls[3] = true;
      matrix[this.i + 1][this.j].walls[1] = true;
    } else if (this.lastDirection == "t" && this.i - 1 >= 0) {
      matrix[this.i][this.j].walls[1] = true;
      matrix[this.i - 1][this.j].walls[3] = true;
    }

    return matrix;
  }

  draw() {
    let y = this.i * this.wGrid + this.offsetY + this.w / 2;
    let x = this.j * this.wGrid + this.offsetX + this.w / 2;

    noStroke();
    fill(255, 100, 100);
    if (this.lastDirection == "r") arc(x, y, this.w, this.w, PI / 6, -PI / 6);
    else if (this.lastDirection == "l")
      arc(x, y, this.w, this.w, PI + PI / 6, PI - PI / 6);
    else if (this.lastDirection == "t")
      arc(x, y, this.w, this.w, -PI / 3, PI + PI / 3);
    else if (this.lastDirection == "b")
      arc(x, y, this.w, this.w, PI - PI / 3, PI / 3);
  }
}

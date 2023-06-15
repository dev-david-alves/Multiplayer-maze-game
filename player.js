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
    this.i += i;
    this.j += j;

    if (j < 0) this.lastDirection = "l";
    else if (i < 0) this.lastDirection = "t";
    else if (j > 0) this.lastDirection = "r";
    else if (i > 0) this.lastDirection = "b";
  }

  playerRemoveWall(matrix) {
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

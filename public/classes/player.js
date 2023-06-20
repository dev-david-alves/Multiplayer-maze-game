class Player {
  constructor(i, j, wGrid, matrix, socket, id) {
    this.i = i;
    this.j = j;
    this.wGrid = wGrid;
    this.w = wGrid * 0.7;
    this.matrix = matrix;
    this.socket = socket;
    this.id = id;
    this.wallsToAdd = 3;
    this.wallsToDestroy = 3;
    this.lastDirection = "r";
    this.color = { r: 0, g: 255, b: 100 };
  }

  move(i, j) {
    if (
      (j < 0 && !this.matrix[this.i][this.j].walls[0]) ||
      (j > 0 && !this.matrix[this.i][this.j].walls[2])
    )
      this.j += j;
    else if (
      (i < 0 && !this.matrix[this.i][this.j].walls[1]) ||
      (i > 0 && !this.matrix[this.i][this.j].walls[3])
    )
      this.i += i;
  }

  removeWall() {
    if (this.wallsToDestroy == 0) return this.matrix;

    if (
      this.lastDirection == "r" &&
      this.j + 1 < this.matrix[0].length &&
      this.matrix[this.i][this.j].walls[2]
    ) {
      this.matrix[this.i][this.j].walls[2] = false;
      this.matrix[this.i][this.j + 1].walls[0] = false;
      this.wallsToDestroy -= 1;
    } else if (
      this.lastDirection == "l" &&
      this.j - 1 >= 0 &&
      this.matrix[this.i][this.j].walls[0]
    ) {
      this.matrix[this.i][this.j].walls[0] = false;
      this.matrix[this.i][this.j - 1].walls[2] = false;
      this.wallsToDestroy -= 1;
    } else if (
      this.lastDirection == "b" &&
      this.i + 1 < this.matrix.length &&
      this.matrix[this.i][this.j].walls[3]
    ) {
      this.matrix[this.i][this.j].walls[3] = false;
      this.matrix[this.i + 1][this.j].walls[1] = false;
      this.wallsToDestroy -= 1;
    } else if (
      this.lastDirection == "t" &&
      this.i - 1 >= 0 &&
      this.matrix[this.i][this.j].walls[1]
    ) {
      this.matrix[this.i][this.j].walls[1] = false;
      this.matrix[this.i - 1][this.j].walls[3] = false;
      this.wallsToDestroy -= 1;
    }

    this.socket.emit("mazeUpdate", this.matrix);

    return this.matrix;
  }

  addWall() {
    if (this.wallsToAdd == 0) return this.matrix;

    if (
      this.lastDirection == "r" &&
      this.j + 1 < this.matrix[0].length &&
      !this.matrix[this.i][this.j].walls[2]
    ) {
      this.matrix[this.i][this.j].walls[2] = true;
      this.matrix[this.i][this.j + 1].walls[0] = true;
      this.wallsToAdd -= 1;
    } else if (
      this.lastDirection == "l" &&
      this.j - 1 >= 0 &&
      !this.matrix[this.i][this.j].walls[0]
    ) {
      this.matrix[this.i][this.j].walls[0] = true;
      this.matrix[this.i][this.j - 1].walls[2] = true;
      this.wallsToAdd -= 1;
    } else if (
      this.lastDirection == "b" &&
      this.i + 1 < this.matrix.length &&
      !this.matrix[this.i][this.j].walls[3]
    ) {
      this.matrix[this.i][this.j].walls[3] = true;
      this.matrix[this.i + 1][this.j].walls[1] = true;
      this.wallsToAdd -= 1;
    } else if (
      this.lastDirection == "t" &&
      this.i - 1 >= 0 &&
      !this.matrix[this.i][this.j].walls[1]
    ) {
      this.matrix[this.i][this.j].walls[1] = true;
      this.matrix[this.i - 1][this.j].walls[3] = true;
      this.wallsToAdd -= 1;
    }

    this.socket.emit("mazeUpdate", this.matrix);

    return this.matrix;
  }

  draw() {
    let offset = this.w / 2 + (this.wGrid - this.w) / 2;
    let y = this.i * this.wGrid + offset;
    let x = this.j * this.wGrid + offset;

    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    if (this.lastDirection == "r") arc(x, y, this.w, this.w, PI / 6, -PI / 6);
    else if (this.lastDirection == "l")
      arc(x, y, this.w, this.w, PI + PI / 6, PI - PI / 6);
    else if (this.lastDirection == "t")
      arc(x, y, this.w, this.w, -PI / 3, PI + PI / 3);
    else if (this.lastDirection == "b")
      arc(x, y, this.w, this.w, PI - PI / 3, PI / 3);

    let data = {
      i: this.i,
      j: this.j,
      wGrid: this.wGrid,
      wP: this.w,
      lastDirection: this.lastDirection,
    };

    this.socket.emit("pMove", data);
  }
}

import RigidBody from "../lib/rigidbody";
import Vector from "../lib/vector";
import Calculator from "../utils/calculator";
import Draw from "../utils/draw";

export default class SpatialGrid {
  world: Vector;
  cellSize: number;
  cells: RigidBody[][];
  cellCntX: number;
  cellCntY: number;
  objects: RigidBody[];
  objectsToCells: number[][];
  drawUtils: Draw;
  calculatorUtils: Calculator;

  constructor(cellSize: number) {
    this.world = new Vector({ x: 0, y: 0 });
    this.cellSize = cellSize;
    this.cells = [];
    this.cellCntX = 0;
    this.cellCntY = 0;
    this.objects = [];
    this.objectsToCells = [];
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
  }

  initialize(world: Vector, objects: RigidBody[]) {
    this.world = world;
    this.objects = objects;
    this.cellCntX = parseInt(String(this.world.x / this.cellSize));
    this.cellCntY = parseInt(String(this.world.y / this.cellSize));
    if (this.cellSize * this.cellCntX < this.world.x) {
      this.cellCntX++;
    }
    if (this.cellSize * this.cellCntY < this.world.y) {
      this.cellCntY++;
    }

    for (let i = 0; i < this.cellCntX * this.cellCntY; i++) {
      this.cells[i] = [];
    }

    // console.log(this.cells.length + " cells initiated");
  }

  refreshGrid() {
    this.clearGrid();
    this.mapBodiesToCell();
  }

  mapBodiesToCell() {
    for (let i = 0; i < this.objects.length; i++) {
      let boundingBox = this.objects[i].getShape().boundingBox;
      let left = boundingBox.topLeft.x;
      let right = boundingBox.bottomRight.x;
      let top = boundingBox.topLeft.y;
      let bottom = boundingBox.bottomRight.y;

      let leftCellIndex = this.calculatorUtils.clamp(
        parseInt(String(left / this.cellSize)),
        this.cellCntX - 1,
        0
      );
      let RightCellIndex = this.calculatorUtils.clamp(
        parseInt(String(right / this.cellSize)),
        this.cellCntX - 1,
        0
      );
      let topCellIndex = this.calculatorUtils.clamp(
        parseInt(String(top / this.cellSize)),
        this.cellCntY - 1,
        0
      );
      let bottomCellIndex = this.calculatorUtils.clamp(
        parseInt(String(bottom / this.cellSize)),
        this.cellCntY - 1,
        0
      );

      for (let x = leftCellIndex; x <= RightCellIndex; x++) {
        for (let y = topCellIndex; y <= bottomCellIndex; y++) {
          let cellIndex = x + y * this.cellCntX;
          this.cells[cellIndex].push(this.objects[i]);
          this.objectsToCells[i].push(cellIndex);
          let position = new Vector({
            x: x * this.cellSize + 5,
            y: y * this.cellSize + 5,
          });

          this.drawUtils.drawRect(
            position,
            new Vector({ x: this.cellSize - 5, y: this.cellSize - 5 }),
            "grey"
          );
        }
      }
    }
  }

  clearGrid() {
    this.objectsToCells = [];

    for (let i = 0; i < this.objects.length; i++) {
      this.objectsToCells[i] = [];
    }

    for (let i = 0; i < this.cellCntX * this.cellCntY; i++) {
      this.cells[i] = [];
    }
  }

  getNeighborObject(objectIndex: number, object: RigidBody) {
    let occupiedCells = this.objectsToCells[objectIndex];
    let neighborObjects: RigidBody[] = [];
    for (let i = 0; i < occupiedCells.length; i++) {
      let occupiedCellIndex = occupiedCells[i];
      let occupiedCell = this.cells[occupiedCellIndex];
      for (let j = 0; j < occupiedCell.length; j++) {
        let objectInCell = occupiedCell[j];
        if (objectInCell != object) {
          neighborObjects.push(objectInCell);
        }
      }
    }
    return neighborObjects.filter(
      (item, index) => neighborObjects.indexOf(item) === index
    );
  }

  getContentOfCell(id: number) {
    return this.cells[id];
  }

  getCellIdFromPosition(pos: Vector) {
    let x = parseInt(String(pos.x / this.cellSize));
    let y = parseInt(String(pos.y / this.cellSize));
    return x + y * this.cellCntX;
  }

  draw() {
    for (let i = 0; i < this.cellCntX; i++) {
      for (let j = 0; j < this.cellCntY; j++) {
        let position = new Vector({
          x: i * this.cellSize + 5,
          y: j * this.cellSize + 5,
        });

        this.drawUtils.drawRect(
          position,
          new Vector({ x: this.cellSize - 5, y: this.cellSize - 5 }),
          "grey"
        );
      }
    }
  }
}

import RigidBody from '@engine/lib/rigidbody';
import Vector from '@engine/lib/vector';
import Calculator from '@engine/utils/calculator';
import Draw from '@engine/utils/draw';

export default class Grid {
  world: Vector;
  cellSize: number;
  cells: RigidBody[][];
  cellCntX: number;
  cellCntY: number;
  drawUtils: Draw;
  calculatorUtils: Calculator;

  constructor(cellSize: number) {
    this.world = new Vector({ x: 0, y: 0 });
    this.cellSize = cellSize;
    this.cells = [];
    this.cellCntX = 0;
    this.cellCntY = 0;
    this.drawUtils = Draw.getInstance();
    this.calculatorUtils = Calculator.getInstance();
  }

  initialize(world: Vector, objects: RigidBody[]) {
    this.world = world;
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
          x: (i + 0.5) * this.cellSize,
          y: (j + 0.5) * this.cellSize,
        });

        this.drawUtils.drawRect(
          position,
          new Vector({ x: this.cellSize - 5, y: this.cellSize - 5 }),
          'grey',
        );
      }
    }
  }
}

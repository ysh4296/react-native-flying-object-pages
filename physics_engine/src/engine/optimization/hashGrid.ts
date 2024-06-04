import RigidBody from "../lib/rigidbody";
import Vector from "../lib/vector";
import SpatialGrid from "./spatialGrid";

export default class HashGrid extends SpatialGrid {
  hashMap: Map<number, RigidBody[]>;
  hashMapSize: number;
  p1Prime: number;
  p2Prime: number;
  constructor(cellSize: number) {
    super(cellSize);
    this.hashMap = new Map();
    this.objectsToCells = [];

    this.hashMapSize = 10000;
    this.p1Prime = 125311;
    this.p2Prime = 588667;
  }

  initialize(world: Vector, objects: RigidBody[]) {
    this.world = world;
    this.objects = objects;
  }

  refreshGrid() {
    this.clearGrid();
    this.mapBodiesToCell();
  }

  clearGrid() {
    this.hashMap.clear();
    this.objectsToCells = [];

    for (let i = 0; i < this.objects.length; i++) {
      this.objectsToCells[i] = [];
    }
  }

  cellIndexToHash(x: number, y: number) {
    let hash = ((x * this.p1Prime) ^ (y * this.p2Prime)) % this.hashMapSize;
    return hash;
  }

  mapBodiesToCell() {
    for (let i = 0; i < this.objects.length; i++) {
      let boundingBox = this.objects[i].getShape().boundingBox;
      let left = boundingBox.topLeft.x;
      let right = boundingBox.bottomRight.x;
      let top = boundingBox.topLeft.y;
      let bottom = boundingBox.bottomRight.y;

      let leftCellIndex = parseInt(String(left / this.cellSize));
      let RightCellIndex = parseInt(String(right / this.cellSize));
      let topCellIndex = parseInt(String(top / this.cellSize));
      let bottomCellIndex = parseInt(String(bottom / this.cellSize));

      for (let x = leftCellIndex; x <= RightCellIndex; x++) {
        for (let y = topCellIndex; y <= bottomCellIndex; y++) {
          let hashIndex = this.cellIndexToHash(x, y);
          let entries = this.hashMap.get(hashIndex);
          if (entries === undefined) {
            let newArray = [this.objects[i]];
            this.hashMap.set(hashIndex, newArray);
          } else {
            entries.push(this.objects[i]);
          }
          this.objectsToCells[i].push(hashIndex);
        }
      }
    }
  }

  getNeighborObject(objectIndex: number, object: RigidBody) {
    let occupiedCells = this.objectsToCells[objectIndex];
    let neighborObjects: RigidBody[] = [];
    for (let i = 0; i < occupiedCells.length; i++) {
      let occupiedCellHashIndex = occupiedCells[i];
      let occupiedCell = this.hashMap.get(occupiedCellHashIndex);
      if (occupiedCell) {
        for (let j = 0; j < occupiedCell.length; j++) {
          let objectInCell = occupiedCell[j];
          if (objectInCell != object) {
            neighborObjects.push(objectInCell);
          }
        }
      }
    }
    return neighborObjects.filter(
      (item, index) => neighborObjects.indexOf(item) === index
    );
  }
}

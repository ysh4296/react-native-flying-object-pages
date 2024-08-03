import Component from '@engine/lib/component/component';
import RigidBody from '@rigidbody/rigidbody';
import Vector from '@engine/lib/vector';
import Grid from './grid';

export default class HashGrid extends Grid {
  hashMap: Map<number, RigidBody[]>;
  hashMapSize: number;
  p1Prime: number;
  p2Prime: number;
  components: Component[];
  objectsToCells: Map<ObjectCode, number[]>;
  constructor(cellSize: number) {
    super(cellSize);
    this.hashMap = new Map();
    this.objectsToCells = new Map(); // map<number,rigidBody[]>
    this.components = [];

    this.hashMapSize = 10000;
    this.p1Prime = 125311;
    this.p2Prime = 588667;
  }

  initializeComponent(world: Vector, components: Component[]) {
    this.world = world;
    this.components = components;
  }

  refreshGrid() {
    this.clearGrid();
    this.mapBodiesToCell();
  }

  clearGrid() {
    this.hashMap.clear();
    this.objectsToCells.clear();
  }

  cellIndexToHash(x: number, y: number) {
    let hash = ((x * this.p1Prime) ^ (y * this.p2Prime)) % this.hashMapSize;
    return hash;
  }

  mapBodiesToCell() {
    this.components.forEach((component) => {
      for (let i = 0; i < component.objects.length; i++) {
        const objectCode: ObjectCode = `${component.id}:${component.objects[i].id}`;

        let boundingBox = component.objects[i].getShape().boundingBox;
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
            const entries = this.hashMap.get(hashIndex);
            if (entries === undefined) {
              let newArray = [component.objects[i]];
              this.hashMap.set(hashIndex, newArray);
            } else {
              entries.push(component.objects[i]);
            }

            const cells = this.objectsToCells.get(objectCode);
            if (cells === undefined) {
              let newArray = [hashIndex];
              this.objectsToCells.set(objectCode, newArray);
            } else {
              cells.push(hashIndex);
            }
          }
        }
      }
      for (let i = 0; i < component.effects.length; i++) {
        const objectCode: ObjectCode = `${component.id}:${component.effects[i].id}`;

        let boundingBox = component.effects[i].getShape().boundingBox;
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
              let newArray = [component.effects[i]];
              this.hashMap.set(hashIndex, newArray);
            } else {
              entries.push(component.effects[i]);
            }

            const cells = this.objectsToCells.get(objectCode);
            if (cells === undefined) {
              let newArray = [hashIndex];
              this.objectsToCells.set(objectCode, newArray);
            } else {
              cells.push(hashIndex);
            }
          }
        }
      }
    });
  }

  getNeighborObject(objectCode: ObjectCode, object: RigidBody) {
    let occupiedCells = this.objectsToCells.get(objectCode) ?? [];
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
    return neighborObjects.filter((item, index) => neighborObjects.indexOf(item) === index);
  }

  getContentOfCell(id: number) {
    let content = this.hashMap.get(id);
    if (content === null || content === undefined) return [];
    return content;
  }
  getCellIdFromPosition(pos: Vector) {
    let x = parseInt(String(pos.x / this.cellSize));
    let y = parseInt(String(pos.y / this.cellSize));
    return this.cellIndexToHash(x, y);
  }
}

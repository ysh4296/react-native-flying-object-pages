import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import Rectangle from '@engine/lib/rectangle';
import RigidBody from '@engine/lib/rigidbody';
import Shape from '@engine/lib/shape';
import Vector, { rotateVector, subVector } from '@engine/lib/vector';

type EditType = 'NONE' | 'POSITION' | 'DIRECTION';

export default class EditMouse {
  mousePosition: Vector;
  editType: EditType;
  rotateSelectBox: Shape;
  rotateSelectBoxStyle: Vector;

  constructor() {
    this.mousePosition = new Vector({ x: 0, y: 0 });
    this.editType = 'NONE';
    this.rotateSelectBox = new Rectangle(new Vector({ x: 0, y: 0 }), 10, 10, '');
    this.rotateSelectBoxStyle = new Vector({ x: 20, y: 20 });
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    /** change mouse cursor style */
    let currentPosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = currentPosition;

    const selectedObject = engine.rigidBodies.find(
      (object: RigidBody) => object.id === registry.selectedObjectId,
    );
    if (!selectedObject) return;

    /**
     * not grabbing anything
     * just change cursor besides on moust position
     */
    if (this.editType === 'NONE') {
      if (this.rotateSelectBox.isInside(this.mousePosition)) {
        registry.engine.canvas.style.cursor = 'grab';
        return;
      }
      if (selectedObject.shape.isInside(this.mousePosition)) {
        registry.engine.canvas.style.cursor = 'grab';
        return;
      }
      registry.engine.canvas.style.cursor = 'default';
    }

    if (this.editType === 'DIRECTION') {
      /**
       * change orientation to Selected direction
       */
      const rotatedVector = rotateVector(
        new Vector({ x: 0, y: 100 }),
        selectedObject.shape.orientation,
      );
      const radian = engine.calculatorUtils.getAngleBetweenVectors(
        rotatedVector,
        subVector(selectedObject.shape.centroid, this.mousePosition),
      );
      selectedObject.shape.rotate(radian);
      this.rotateSelectBox.rotate(radian, selectedObject.shape.centroid);
    }

    /**
     * change position to currentMouse
     */
    if (this.editType === 'POSITION') {
      const Delta = subVector(this.mousePosition, selectedObject.shape.centroid);

      selectedObject.shape.move(Delta);
      this.rotateSelectBox.move(Delta);
    }
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let currentPosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = currentPosition;

    const selectedObject = engine.rigidBodies.find(
      (object: RigidBody) => object.id === registry.selectedObjectId,
    );

    if (!selectedObject) return;

    if (this.rotateSelectBox.isInside(this.mousePosition)) {
      this.editType = 'DIRECTION';
      registry.engine.canvas.style.cursor = 'grabbing';
      return;
    }
    if (selectedObject.shape.isInside(this.mousePosition)) {
      this.editType = 'POSITION';
      registry.engine.canvas.style.cursor = 'grabbing';
      return;
    }

    this.editType = 'NONE';
    registry.setMouseEventType('NONE');
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.editType = 'NONE';
    registry.engine.canvas.style.cursor = 'default';
  }

  setSelectBox(target: RigidBody) {
    registry.selectedObjectId = target.id;

    this.rotateSelectBox = new Rectangle(
      new Vector({ x: target.shape.centroid.x, y: target.shape.centroid.y - 100 }),
      this.rotateSelectBoxStyle.x,
      this.rotateSelectBoxStyle.y,
      '',
    );
    this.rotateSelectBox.rotate(target.shape.orientation, target.shape.centroid);
  }

  drawSelect() {
    /**
     * blur screen
     */
    registry.engine.drawUtils.fillRect(
      new Vector({
        x:
          -registry.engine.camera.x / registry.engine.camera.scale +
          registry.engine.canvas.width / registry.engine.camera.scale / 2,
        y:
          -registry.engine.camera.y / registry.engine.camera.scale +
          registry.engine.canvas.height / registry.engine.camera.scale / 2,
      }),
      new Vector({
        x: registry.engine.canvas.width / registry.engine.camera.scale,
        y: registry.engine.canvas.height / registry.engine.camera.scale,
      }),
      'rgba(0,0,0,0.4)',
    );

    const selectedObject = registry.engine.rigidBodies.find(
      (object: RigidBody) => object.id === registry.selectedObjectId,
    );

    /**
     * Edit only affect with object position & direction
     */

    if (!selectedObject) return;

    selectedObject.shape.draw();

    /** Draw Select Box */
    registry.engine.drawUtils.fillRect(
      this.rotateSelectBox.centroid,
      this.rotateSelectBoxStyle,
      'white',
      this.rotateSelectBox.orientation,
    );

    for (let i = 1; i < selectedObject.shape.vertices.length; i++) {
      registry.engine.drawUtils.drawDottedLine(
        selectedObject.shape.vertices[i - 1],
        selectedObject.shape.vertices[i],
        'black',
        registry.animationOffset * 0.1,
      );
    }
    registry.engine.drawUtils.drawDottedLine(
      selectedObject.shape.vertices[this.rotateSelectBox.vertices.length - 1],
      selectedObject.shape.vertices[0],
      'black',
      registry.animationOffset * 0.1,
    );
  }
}

import Engine from '@engine/lib/engine';
import getMousePosition from '@engine/lib/getMousePosition';
import { registry } from '@engine/lib/main';
import RigidBody from '@rigidbody/rigidbody';
import Rectangle from '@rigidbody/rectangle';
import Vector, { subVector } from '@engine/lib/vector';
import { assertUnreachableChecker } from '@utils/typeChecker';
import Matter from '@engine/lib/matter';
import Charactor from '@engine/lib/game/charactor';
import Circle from '@engine/lib/rigidbody/circle';
import { skillData } from '@engine/lib/game/data/skillData';

export default class CreateMouse {
  start: Vector;
  end: Vector;
  mousePosition: Vector;
  isEdit: boolean;
  target: RigidBody;
  // for some special creation / ex) escalator
  additionalTarget: Vector;
  additionalTargetSelected: boolean;

  constructor() {
    this.start = new Vector({ x: 0, y: 0 });
    this.end = new Vector({ x: 0, y: 0 });

    this.target = new RigidBody(new Circle(new Vector({ x: 0, y: 0 }), 5, 'black'), 0);
    this.mousePosition = new Vector({ x: 0, y: 0 });
    this.isEdit = false;
    this.additionalTargetSelected = false;
    this.additionalTarget = new Vector({ x: 0, y: 0 });
  }

  mouseMove(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    let mousePosition: Vector = getMousePosition(canvas, e);
    this.mousePosition = mousePosition;

    if (this.mousePosition.isOut()) return;
    this.target.shape.move(
      subVector(
        engine.GameBoard.cellIdToCenteroid(
          engine.GameBoard.getCellIdFromPosition(this.mousePosition),
        ),
        this.target.shape.centroid,
      ),
    );
  }

  mouseDown(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.start = this.mousePosition;
    this.isEdit = true;
  }

  mouseUp(e: MouseEvent, canvas: HTMLCanvasElement, engine: Engine) {
    this.end = this.mousePosition;
    switch (registry.createEventType) {
      case 'NONE':
        break;
      case 'RECTANGLE':
        registry.engine.objects.push(
          new RigidBody(
            new Rectangle(
              new Vector(this.target.shape.centroid),
              registry.engine.GameBoard.cellSize,
              registry.engine.GameBoard.cellSize,
              'green',
            ),
            1,
          ),
        );
        break;
      case 'CIRCLE':
        const circle = new RigidBody(
          new Circle(
            new Vector(this.target.shape.centroid),
            registry.engine.GameBoard.cellSize / 4,
            'green',
          ),
          0,
        );

        circle.matter = new Matter(0.8, 0);

        registry.engine.objects.push(circle);
        break;
      case 'MAGICIAN':
        const magician = new RigidBody(
          new Circle(new Vector(this.target.shape.centroid), 25, 'blue'),
        );
        const spriteConfiguration: spriteConfiguration = {
          source: 'charactor',
          width: 72,
          height: 72,
          row: 0,
          column: 0,
        };
        magician.shape.draw = () => {
          registry.sprite.newDrawSprite(magician, spriteConfiguration);
        };

        registry.engine.objects.push(magician);
        const magicianCharactor = new Charactor(
          magician.id,
          {
            STR: 5,
            VIT: 5,
            INT: 5,
            DEX: 5,
            LCK: 5,
            AGI: 5,
            SPI: 5,
          },
          skillData[0],
          magician,
        );
        // magicianCharactor.battleStat.MP = 1000000;
        registry.engine.charactorMap.set(magician.id, magicianCharactor);
        break;
      default:
        assertUnreachableChecker(registry.createEventType);
    }
    this.isEdit = false;
  }

  drawCreate() {
    if (this.target.shape.centroid.x === 0 && this.target.shape.centroid.y === 0) return;

    this.target.shape.draw();

    /** blur item */
    registry.engine.drawUtils.fillRect(
      new Vector({
        x: +this.target.shape.centroid.x,
        y: +this.target.shape.centroid.y,
      }),
      new Vector({
        x: registry.engine.GameBoard.cellSize,
        y: registry.engine.GameBoard.cellSize,
      }),
      'rgba(255,255,255,0.6)',
    );
  }
}

import RigidBody from '@engine/lib/rigidbody/rigidbody';
import Vector from '@engine/lib/vector';
import Charactor from '../charactor';

export abstract class Attribute {
  private extraCondition: AttributeCondition;

  constructor() {}

  getCondition(): AttributeCondition | null {
    return this.extraCondition || null;
  }

  addCondition(condition: AttributeCondition): Attribute {
    this.extraCondition = condition;
    return this;
  }
}

export type AttributeCondition = ((charactor: Charactor) => boolean) | undefined;

export class BounceAttribute extends Attribute {
  hit: Vector;
  constructor() {
    super();
    this.hit = new Vector({ x: 100, y: -100 });
  }

  apply(target: RigidBody): boolean | Promise<boolean> {
    target.velocity.add(this.hit);
    return true;
  }
}

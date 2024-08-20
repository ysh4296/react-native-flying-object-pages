import { Attribute } from '../attribute/attribute';
import Charactor from '../charactor';

export default class Skill {
  public id: number;
  public cost: number;
  description?: string;
  public attributes: Attribute[]; // special traits for skill use it with apply
  user: any;

  constructor(id: number) {
    this.id = id;
    this.cost = 100;
    this.attributes = [];
  }

  canApply(): boolean {
    return true;
  }

  apply(user: Charactor) {
    user.battleStat.MP -= this.cost;
  }

  setTarget() {}

  getTargetBenefitScore(user: Charactor, target: Charactor): number {
    let score = 0;

    // for (const attr of this.attributes ?? []) {
    // conditionals to check if the move is self targeting (if so then you are applying the move to yourself, not the target)
    // score +=
    //   attr.getTargetBenefitScore(user, !attr.selfTarget ? target : user, this) *
    //   (target !== user && attr.selfTarget ? -1 : 1);
    // }

    return score;
  }

  hasAttribute<T extends Attribute>(attribute: Constructor<T>): boolean {
    return true;
  }

  addAttribute<T extends Constructor<Attribute>>(
    attribute: T,
    ...args: ConstructorParameters<T>
  ): Skill {
    const attr = new attribute(...args);
    this.attributes.push(attr);
    return this;
  }
}

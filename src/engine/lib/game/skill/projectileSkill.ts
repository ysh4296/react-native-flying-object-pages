import Charactor from '../charactor';
import Skill from './skill';

export default class ProjectileSkill extends Skill {
  constructor(id: number) {
    super(id);
  }

  apply(user: Charactor) {
    super.apply(user);

    // add projectile
    this.addProjectile([]);
  }

  addProjectile(projectile: any) {}
}

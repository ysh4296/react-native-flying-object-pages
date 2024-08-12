import ImageCircle from '@engine/lib/balls/imageCircle';
import Monster from '@engine/lib/component/defense/monster';
import { registry } from '@engine/lib/main';
import RigidBody from '@engine/lib/rigidbody/rigidbody';
import { subVector } from '@engine/lib/vector';
import CollisionManifold from './collisionManifold';

export default class CollisionCache {
  lastCollisionTime: Map<string, number>;
  cooldown: number;

  constructor(cooldown: number = 100) {
    this.lastCollisionTime = new Map();
    this.cooldown = cooldown; // 쿨다운 시간 (밀리초)
  }

  hasCooldownPassed(id1: number, id2: number): boolean {
    if (id1 > id2) {
      [id1, id2] = [id2, id1];
    }
    const key = `${id1}-${id2}`;
    const now = registry.gameTime;
    const lastTime = this.lastCollisionTime.get(key) || 0;
    if (now - lastTime > this.cooldown) {
      this.lastCollisionTime.set(key, now);
      return true;
    }
    return false;
  }

  clear() {
    this.lastCollisionTime.clear();
  }

  onCollision(result: CollisionManifold, objectA: RigidBody, objectB: RigidBody) {
    /**
     * length of Collision Vector usually 0 to 600
     */
    if (this.hasCooldownPassed(objectA.id, objectB.id)) {
      let collisionVector = subVector(objectA.velocity, objectB.velocity);
      let damage = registry.engine.calculatorUtils.clamp(collisionVector.length(), 600, 10);

      damage = Math.ceil(damage / 10);
      // console.log('cooldown');
      // execute collision Event
      let id1 = objectA.id;
      let id2 = objectB.id;
      if (id1 > id2) {
        [id1, id2] = [id2, id1];
      }
      const key = `${id1}-${id2}`;
      if (objectA instanceof ImageCircle) {
        /**
         *  object A glowing
         *  glowed by objectA, objectB collision
         */
        // console.log('update : ', objectA.shape.collisionTime);
        objectA.shape.collisionTime = Math.max(
          objectA.shape.collisionTime,
          this.lastCollisionTime.get(key) || 0,
        );
        // objectA.velocity.scale(0.8);
        registry.engine.damageText.addDamageText(
          (result.penetrationPoint.x + objectA.shape.centroid.x) / 2,
          (result.penetrationPoint.y + objectA.shape.centroid.y) / 2,
          damage,
        );

        // console.log('after : ', objectA.shape.collisionTime);
        // damaging
        const targetMonster = registry.engine.components.find((component) =>
          component.objects.find((object) => object.id === objectA.id),
        );
        if (targetMonster instanceof Monster) {
          targetMonster.hp -= damage;
        }
      }

      if (objectB instanceof ImageCircle) {
        /**
         *  object B glowing
         *  glowed by objectA, objectB collision
         */

        objectB.shape.collisionTime = Math.max(
          objectB.shape.collisionTime,
          this.lastCollisionTime.get(key) || 0,
        );

        // objectB.velocity.scale(0.8);
        registry.engine.damageText.addDamageText(
          (result.penetrationPoint.x + objectB.shape.centroid.x) / 2,
          (result.penetrationPoint.y + objectB.shape.centroid.y) / 2,
          damage,
        );

        // damaging
        const targetMonster = registry.engine.components.find((component) =>
          component.objects.find((object) => object.id === objectB.id),
        );
        if (targetMonster instanceof Monster) {
          targetMonster.hp -= damage;
        }
      }
    }
  }
}

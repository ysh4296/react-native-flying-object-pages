import Circle from "../lib/circle";
import { addVector, scaleVector, subVector } from "../lib/vector";
import CollisionManifold from "./collisionManifold";

export default class Collision {
  private static instance: Collision;
  public static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }
  circlevscircle(circleA: Circle, circleB: Circle) {
    let centroidA = circleA.centroid;
    let centroidB = circleB.centroid;

    let direction = subVector(centroidA, centroidB);

    let radiusSum = circleA.radius + circleB.radius;

    if (direction.lengthSquare() < radiusSum * radiusSum) {
      let directionLength = direction.length();
      let penetratedNormal = scaleVector(direction, 1 / directionLength);
      let penetrationDepth = radiusSum - directionLength;
      let penetrationPoint = subVector(
        centroidA,
        scaleVector(penetratedNormal, circleA.radius)
      );
      return new CollisionManifold(
        penetrationDepth,
        penetratedNormal,
        penetrationPoint
      );
    } else {
      return null;
    }
  }
}

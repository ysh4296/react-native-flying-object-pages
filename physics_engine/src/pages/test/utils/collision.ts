import Circle from "../lib/circle";
import { subVector } from "../lib/vector";

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
      return true;
    } else {
      return false;
    }
  }
}

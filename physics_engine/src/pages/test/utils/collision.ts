import Circle from "../lib/circle";
import Polygon from "../lib/polygon";
import Vector, { addVector, scaleVector, subVector } from "../lib/vector";
import CollisionManifold from "./collisionManifold";

class SupportPoint {
  vertex: Vector;
  penetrationDepth: number;
  constructor(vertex: Vector, penetrationDepth: number) {
    this.vertex = vertex;
    this.penetrationDepth = penetrationDepth;
  }
}

export default class Collision {
  private static instance: Collision;
  public static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }

  circleVScircle(circleA: Circle, circleB: Circle) {
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

  polygonVSpolygon(polygonA: Polygon, polygonB: Polygon) {
    let contactPointA = this.getContactPoint(polygonA, polygonB);
    if (contactPointA === null) {
      return null;
    }
    let contactPointB = this.getContactPoint(polygonB, polygonA);
    if (contactPointB === null) {
      return null;
    }
    if (contactPointA.depth < contactPointB.depth) {
      return new CollisionManifold(
        contactPointA.depth,
        contactPointA.normal,
        contactPointA.penetrationPoint
      );
    } else {
      return new CollisionManifold(
        contactPointB.depth,
        scaleVector(contactPointB.normal, -1),
        contactPointB.penetrationPoint
      );
    }
  }

  getContactPoint(polygonA: Polygon, polygonB: Polygon) {
    let contact = null;
    let minimumPenetrationDepth = Number.MAX_VALUE;

    for (let i = 0; i < polygonA.normals.length; i++) {
      let pointOnEdge = polygonA.vertices[i];
      let normalOnEdge = polygonA.normals[i];

      let supportPoint = this.getSupportPoint(
        normalOnEdge,
        pointOnEdge,
        polygonB.vertices
      );

      if (!supportPoint) {
        return null;
      }

      if (supportPoint.penetrationDepth < minimumPenetrationDepth) {
        minimumPenetrationDepth = supportPoint.penetrationDepth;
        contact = new CollisionManifold(
          supportPoint.penetrationDepth,
          normalOnEdge,
          supportPoint.vertex
        );
      }
    }
    return contact;
  }

  getSupportPoint(
    normalOnEdge: Vector,
    pointOnEdge: Vector,
    polygonVertices: Vector[]
  ) {
    let supportPenetrationDepth = 0;
    let supportPoint = null;

    for (let i = 0; i < polygonVertices.length; i++) {
      let vertex = polygonVertices[i];
      let penetrateVector = subVector(vertex, pointOnEdge);
      let penetrationDepth = penetrateVector.getDotProduct(
        scaleVector(normalOnEdge, -1)
      );

      if (penetrationDepth > supportPenetrationDepth) {
        supportPenetrationDepth = penetrationDepth;
        supportPoint = new SupportPoint(vertex, penetrationDepth);
      }
    }

    return supportPoint;
  }
}

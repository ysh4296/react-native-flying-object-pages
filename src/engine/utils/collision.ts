import Circle from '@engine/lib/Circle';
import Polygon from '@engine/lib/polygon';
import Shape from '@engine/lib/Shape';
import Vector, { addVector, scaleVector, subVector } from '@engine/lib/vector';
import Calculator from './calculator';
import CollisionManifold from './collisionManifold';

class SupportPoint {
  vertex: Vector;
  penetrationDepth: number;
  constructor(vertex: Vector, penetrationDepth: number) {
    this.vertex = vertex;
    this.penetrationDepth = penetrationDepth;
  }
}

export default class Collision {
  calculatorUtil: Calculator;
  private static instance: Collision;
  constructor() {
    this.calculatorUtil = Calculator.getInstance();
  }
  public static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }

  checkCollision(shapeA: Shape, shapeB: Shape) {
    let collisionManifold = null;
    if (shapeA instanceof Circle && shapeB instanceof Circle) {
      collisionManifold = this.circleVScircle(shapeA, shapeB);
    }
    if (shapeA instanceof Polygon && shapeB instanceof Polygon) {
      collisionManifold = this.polygonVSpolygon(shapeA, shapeB);
    }
    if (shapeA instanceof Circle && shapeB instanceof Polygon) {
      collisionManifold = this.circleVSpolygon(shapeA, shapeB);
    }
    if (shapeA instanceof Polygon && shapeB instanceof Circle) {
      collisionManifold = this.circleVSpolygon(shapeB, shapeA);
      if (collisionManifold) {
        collisionManifold?.normal.scale(-1);
        collisionManifold.penetrationPoint.add(
          scaleVector(collisionManifold.normal, collisionManifold.depth),
        );
      }
    }

    return collisionManifold;
  }

  circleVScircle(circleA: Circle, circleB: Circle) {
    let centroidA = circleA.centroid;
    let centroidB = circleB.centroid;

    let direction = subVector(centroidB, centroidA);

    let radiusSum = circleA.radius + circleB.radius;

    if (direction.lengthSquare() < radiusSum * radiusSum) {
      let directionLength = direction.length();
      let penetratedNormal = scaleVector(direction, 1 / directionLength);
      let penetrationDepth = radiusSum - directionLength;
      let penetrationPoint = subVector(centroidA, scaleVector(penetratedNormal, -circleA.radius));
      return new CollisionManifold(penetrationDepth, penetratedNormal, penetrationPoint);
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
        contactPointA.penetrationPoint,
      );
    } else {
      return new CollisionManifold(
        contactPointB.depth,
        scaleVector(contactPointB.normal, -1),
        contactPointB.penetrationPoint,
      );
    }
  }

  getContactPoint(polygonA: Polygon, polygonB: Polygon) {
    let contact = null;
    let minimumPenetrationDepth = Number.MAX_VALUE;

    for (let i = 0; i < polygonA.normals.length; i++) {
      let pointOnEdge = polygonA.vertices[i];
      let normalOnEdge = polygonA.normals[i];

      let supportPoint = this.getSupportPoint(normalOnEdge, pointOnEdge, polygonB.vertices);

      if (!supportPoint) {
        return null;
      }

      if (supportPoint.penetrationDepth < minimumPenetrationDepth) {
        minimumPenetrationDepth = supportPoint.penetrationDepth;
        contact = new CollisionManifold(
          supportPoint.penetrationDepth,
          normalOnEdge,
          supportPoint.vertex,
        );
      }
    }
    return contact;
  }

  getSupportPoint(normalOnEdge: Vector, pointOnEdge: Vector, polygonVertices: Vector[]) {
    let supportPenetrationDepth = 0;
    let supportPoint = null;

    for (let i = 0; i < polygonVertices.length; i++) {
      let vertex = polygonVertices[i];
      let penetrateVector = subVector(vertex, pointOnEdge);
      let penetrationDepth = penetrateVector.getDotProduct(scaleVector(normalOnEdge, -1));

      if (penetrationDepth > supportPenetrationDepth) {
        supportPenetrationDepth = penetrationDepth;
        supportPoint = new SupportPoint(vertex, penetrationDepth);
      }
      if (supportPoint && Math.abs(penetrationDepth - supportPenetrationDepth) === 0) {
        supportPoint = new SupportPoint(
          scaleVector(addVector(vertex, supportPoint.vertex), 0.5),
          penetrationDepth,
        );
      }
    }

    return supportPoint;
  }

  circleVSpolygon(circle: Circle, polygon: Polygon) {
    let contact = this.circleVSpolgonEdges(circle, polygon);
    if (contact) {
      return contact;
    } else {
      return this.circleVSpolygonCorner(circle, polygon);
    }
  }

  circleVSpolgonEdges(circle: Circle, polygon: Polygon) {
    let circleCentroid = circle.centroid;
    let nearestEdgeVertex = null;
    let nearestEdgeNormal = null;
    for (let i = 0; i < polygon.vertices.length; i++) {
      let vertex = polygon.vertices[i];
      let normal = polygon.normals[i];
      let nextVertex =
        polygon.vertices[this.calculatorUtil.getIndex(i + 1, polygon.vertices.length)];

      let vertexToCircle = subVector(circleCentroid, vertex);
      let directionToNext = subVector(nextVertex, vertex);
      let directionToNextLength = directionToNext.length();
      directionToNext.normalize();
      let projection = vertexToCircle.getDotProduct(directionToNext);
      let circleNormalProjection = vertexToCircle.getDotProduct(normal);
      if (projection > 0 && projection < directionToNextLength && circleNormalProjection >= 0) {
        nearestEdgeNormal = normal;
        nearestEdgeVertex = vertex;
      }
    }
    // out of circle-polygonEdge scope
    if (nearestEdgeNormal === null || nearestEdgeVertex === null) {
      return null;
    }

    let penetrationVector = subVector(circleCentroid, nearestEdgeVertex);
    let penetrationProjection = penetrationVector.getDotProduct(nearestEdgeNormal);
    let projectionDepth = penetrationProjection - circle.radius;
    if (projectionDepth < 0) {
      // scale 배율을 radius로 설정해도 될듯?
      let penetreationPoint = addVector(
        circleCentroid,
        scaleVector(nearestEdgeNormal, -circle.radius),
      );
      return new CollisionManifold(
        projectionDepth * -1,
        scaleVector(nearestEdgeNormal, -1),
        penetreationPoint,
      );
    }
    return null;
  }

  circleVSpolygonCorner(circle: Circle, polygon: Polygon) {
    for (let i = 0; i < polygon.vertices.length; i++) {
      let vertex = polygon.vertices[i];
      let direction = subVector(vertex, circle.centroid);
      let distance = direction.length();
      direction.normalize();
      if (distance < circle.radius) {
        let penetrationPoint = addVector(circle.centroid, scaleVector(direction, circle.radius));
        let penetrationDepth = circle.radius - distance;
        return new CollisionManifold(penetrationDepth, direction, penetrationPoint);
      }
    }
    return null;
  }
}

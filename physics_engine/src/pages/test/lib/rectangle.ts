import { Over_the_Rainbow } from "next/font/google";
import Draw from "../utils/draw";
import Polygon from "./polygon";
import Vector, { subVector } from "./vector";

export default class Rectangle extends Polygon {
  position: Vector;
  width: number;
  height: number;
  constructor(position: Vector, width: number, height: number, color: string) {
    super(
      [
        new Vector({ x: position.x - width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y - height / 2 }),
        new Vector({ x: position.x + width / 2, y: position.y + height / 2 }),
        new Vector({ x: position.x - width / 2, y: position.y + height / 2 }),
      ],
      color
    );
    this.position = position;
    super.setCentroid(this.position);
    this.width = width;
    this.height = height;
  }

  calculateInertia(mass: number) {
    return (mass * (this.width * this.width + this.height * this.height)) / 12;
  }
}

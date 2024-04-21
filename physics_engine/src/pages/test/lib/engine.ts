export default class Engine {
  constructor() {}

  update = () => {};

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  };

  onKeyboardPressed = (e: KeyboardEvent) => {
    console.log(e.key);
  };
}

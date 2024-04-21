import { useEffect, useRef } from "react";

const container = () => {
  useEffect(() => {
    if (document) {
      const canvas: HTMLCanvasElement = document.getElementById(
        "myCanvas"
      ) as HTMLCanvasElement;
      canvas.style.backgroundColor = "#eee";
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.rect(20, 40, 50, 50);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }
      let currentTime = 0;

      const loop = () => {
        window.requestAnimationFrame(loop);
        currentTime = performance.now();
        // console.log(currentTime);
      };

      loop();
    }
  }, []);
  return (
    <>
      <p>physics Engine</p>
      <canvas id="myCanvas" width="1200" height="700" />
    </>
  );
};

export default container;

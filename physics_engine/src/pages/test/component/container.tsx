import { useEffect, useRef } from "react";
import main from "../lib/main";

const container = () => {
  useEffect(() => {
    if (document) {
      main(document);
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

import EventSelect from "@/component/eventSelect";
import { useEffect } from "react";
import main, { registry } from "../../../engine/lib/main";

const Container = () => {
  useEffect(() => {
    if (document) {
      main(document);
    }
  }, []);

  return (
    <>
      <p>physics Engine</p>
      <canvas id="myCanvas" width="1200" height="700" />
      <EventSelect
        eventName="Mouse"
        setEventType={(mouseType) => {
          registry.mouseEventType = mouseType;
        }}
      />
      <EventSelect
        eventName="Joint"
        setEventType={(jointType) => {
          registry.jointEventType = jointType;
        }}
      />
    </>
  );
};

export default Container;

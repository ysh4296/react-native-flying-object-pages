import Mouse from "@/engine/event/mouse";
import { create } from "zustand";

export enum MouseType {
  NONE,
  DRAG,
  JOINT,
}

type mouseStoreType = {
  mouseEventType: MouseType;
  setMouseEventType: (eventType: MouseType) => void;
};

const useMouseStore = create<mouseStoreType>((set) => ({
  mouseEventType: MouseType.NONE,
  setMouseEventType: (eventType: MouseType) =>
    set({ mouseEventType: eventType }),
}));

export const getMouseEventLabel = (mouseType: MouseType) => {
  switch (mouseType) {
    case MouseType.NONE:
      return "none";
    case MouseType.DRAG:
      return "drag";
    case MouseType.JOINT:
      return "joint";
  }
};

export default useMouseStore;

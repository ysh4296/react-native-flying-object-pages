import { create } from "zustand";
import { MouseType } from "../enum/engine";

type mouseStoreType = {
  mouseEventType: MouseType;
  setMouseEventType: (eventType: MouseType) => void;
};

const useMouseStore = create<mouseStoreType>((set) => ({
  mouseEventType: "NONE",
  setMouseEventType: (eventType: MouseType) =>
    set({ mouseEventType: eventType }),
}));

export default useMouseStore;

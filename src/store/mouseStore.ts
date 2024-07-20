import { registry } from '@engine/lib/main';
import { create } from 'zustand';

type mouseStoreType = {
  mouseEventType: MouseType;
  setMouseEventType: (eventType: MouseType) => void;
};

const useMouseStore = create<mouseStoreType>((set) => ({
  mouseEventType: 'NONE',
  setMouseEventType: (eventType: MouseType) => {
    /** state used in canvas */
    registry.mouseEventType = eventType;

    /** state used for react app */
    set({ mouseEventType: eventType });
  },
}));

export default useMouseStore;

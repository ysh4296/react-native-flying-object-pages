import { create } from 'zustand';

type mouseStoreType = {
  mouseEventType: MouseType;
  setMouseEventType: (eventType: MouseType) => void;
};

const useMouseStore = create<mouseStoreType>((set) => ({
  mouseEventType: 'NONE',
  setMouseEventType: (eventType: MouseType) => set({ mouseEventType: eventType }),
}));

export default useMouseStore;

type EventName = 'MOUSE' | 'JOINT';

type MouseType = 'NONE' | 'DRAG' | 'JOINT';

type JointType = 'NONE' | 'FORCE' | 'SPRING' | 'REVERSE' | 'FIXED' | 'HINGE';

type EventType = MouseType | JointType;

type CameraType = {
  x: number;
  y: number;
  scale: number;
};

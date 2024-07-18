type EventName = 'MOUSE' | 'JOINT' | 'CREATE';

type MouseType = 'NONE' | 'DRAG' | 'JOINT' | 'CREATE';

type JointType = 'NONE' | 'FORCE' | 'SPRING' | 'REVERSE' | 'FIXED' | 'HINGE';

type CreateType = 'NONE' | 'RECTANGLE' | 'CIRCLE' | 'WATERBLOCK' | 'BACONBLOCK' | 'ESCALATOR';

type EventType = MouseType | JointType | createType;

type CameraType = {
  x: number;
  y: number;
  scale: number;
};

type registryType = {
  engine: Engine | null;
  mouseEventType: MouseType;
  jointEventType: JointType;
  createEventType: CreateType;
};

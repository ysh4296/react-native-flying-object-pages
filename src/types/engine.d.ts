type EventName = 'MOUSE' | 'JOINT' | 'CREATE';

type NoneType = 'NONE';

type MouseType = NoneType | 'DRAG' | 'JOINT' | 'CREATE' | 'EDIT';

type JointType = NoneType | 'FORCE' | 'SPRING' | 'REVERSE' | 'FIXED' | 'HINGE';

type CreateType =
  | NoneType
  | 'RECTANGLE'
  | 'CIRCLE'
  | 'WATERBLOCK'
  | 'BACONBLOCK'
  | 'BREADBLOCK'
  // | 'ESCALATOR'
  | 'SPRING'
  | 'HEATER'
  | 'WHEEL'
  | 'FAN'
  | 'PRESSURE'
  | 'GRINDER';

type EventType = NoneType | MouseType | JointType | CreateType;

type CameraType = {
  x: number;
  y: number;
  scale: number;
};

/**
 * @type ObjectCode
 * @description `${componentId}:${objectId}`
 */
type ObjectCode = string;

/**
 * @type ParticleCode
 * @description `${partidleId}`
 */
type ParticleCode = string;

type defaultRegistryType = {
  createdId: number;
  createdObjects: Set<ObjectCode>; // componentId, objectId || effectId
  selectedComponentId: number;
  mouseEventType: MouseType;
  setMouseEventType: (mouseType: MouseType) => void;
  jointEventType: JointType;
  createEventType: CreateType;
  animationOffset: number;
  gamePhase: GamePhase;
  memory: WebAssembly.Memory;
};

type GamePhase = 'play' | 'pause';

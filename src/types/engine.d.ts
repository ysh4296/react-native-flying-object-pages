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
  | 'GRINDER'
  | 'MAGICIAN';

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
  gameTime: number;
};

type GamePhase = 'play' | 'pause';

type DamageTextType = {
  x: number;
  y: number;
  value: number;
  alpha: number; // 투명도
  lifespan: number; // 남은 시간 (밀리초)
  velocityY: number; // 위로 떠오르는 속도
};

type spriteConfiguration = {
  source: string;
  width: number;
  height: number;
  row: number;
  column: number;
};

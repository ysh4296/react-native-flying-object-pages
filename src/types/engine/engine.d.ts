type EventName = 'MOUSE' | 'JOINT' | 'CREATE';

type NoneType = 'NONE';

type MouseType = NoneType | 'DRAG' | 'JOINT' | 'CREATE' | 'EDIT';

type JointType = NoneType | 'FORCE' | 'SPRING' | 'REVERSE' | 'FIXED' | 'HINGE';

type CreateType = NoneType | 'RECTANGLE' | 'CIRCLE' | 'MAGICIAN';

type EventType = NoneType | MouseType | JointType | CreateType;

type Position = { x: number; y: number };

type CameraType = {
  x: number;
  y: number;
  scale: number;
};

/**
 * @type ParticleCode
 * @description `${partidleId}`
 */
type ParticleCode = string;

type defaultRegistryType = {
  createdId: number;
  selectedObjectId: number;
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

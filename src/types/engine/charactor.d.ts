type CharactorState = 'idle' | 'damage' | 'skill';

interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CharactorAnimationConfig {
  graphic: string;
  frames: {
    [key in CharactorState]: (Sprite & { frameRate: number })[];
  };
}

/**
 * @deprecated
 * convert to
 * @type CharactorAnimationConfig
 */
type spriteConfiguration = {
  source: string;
  width: number;
  height: number;
  row: number;
  column: number;
};

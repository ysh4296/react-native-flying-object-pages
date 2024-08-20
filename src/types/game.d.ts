type Constructor<T> = new (...args: unknown[]) => T;

interface Stat {
  STR: number; // strength
  VIT: number; // vitality
  INT: number; // intelligence
  SPI: number; // spirit
  DEX: number; // dexturey
  LCK: number; // luck
  AGI: number; // agility
}

interface BattleStat {
  ATK: number;
  MAG: number;
  CRIT: number;
  CRITDMG: number;
  DEF: number;
  RESIST: number;
  HP: number;
  HPRegen: number;
  MP: number;
  MPRegen: number;
  CoolDown: number;
}

interface Equipment {
  id: number;
  description: string;
  modifier: {
    [K in keyof Stat]?: Stat[K];
  };
}

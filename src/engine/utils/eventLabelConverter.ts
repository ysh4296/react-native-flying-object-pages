export const getEventLabel = (eventType?: EventType) => {
  switch (eventType) {
    case 'NONE':
      return 'none';
    case 'DRAG':
      return 'drag';
    case 'JOINT':
      return 'joint';
    case 'CREATE':
      return 'create';
    case 'FORCE':
      return 'force';
    case 'SPRING':
      return 'spring';
    case 'REVERSE':
      return 'reverse';
    case 'FIXED':
      return 'fixed';
    case 'HINGE':
      return 'hinge';
    case 'CIRCLE':
      return 'circle';
    case 'RECTANGLE':
      return 'rectangle';
    case 'WATERBLOCK':
      return 'waterblock';
    case 'BACONBLOCK':
      return 'baconblock';
    case 'ESCALATOR':
      return 'escalator';
    default:
      return 'no data';
  }
};

export const getEventList = (eventName?: EventName): EventType[] => {
  switch (eventName) {
    case 'MOUSE':
      return ['NONE', 'DRAG', 'JOINT', 'CREATE'];
    case 'JOINT':
      return ['NONE', 'FORCE', 'SPRING', 'REVERSE', 'FIXED', 'HINGE'];
    case 'CREATE':
      return ['NONE', 'CIRCLE', 'RECTANGLE', 'WATERBLOCK', 'BACONBLOCK', 'ESCALATOR'];
    default:
      return [];
  }
};

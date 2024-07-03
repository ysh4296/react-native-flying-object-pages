export const getEventLabel = (eventType?: EventType) => {
  switch (eventType) {
    case 'NONE':
      return 'none';
    case 'DRAG':
      return 'drag';
    case 'JOINT':
      return 'joint';
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
    default:
      return 'no data';
  }
};

export const getEventList = (eventName?: EventName): EventType[] => {
  switch (eventName) {
    case 'Mouse':
      return ['NONE', 'DRAG', 'JOINT'];
    case 'Joint':
      return ['NONE', 'FORCE', 'SPRING', 'REVERSE', 'FIXED', 'HINGE'];
    default:
      return [];
  }
};

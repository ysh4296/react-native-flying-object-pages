import { assertUnreachableChecker } from '@utils/typeChecker';

export const getEventLabel = (eventType: EventType): string => {
  switch (eventType) {
    case 'NONE':
      return 'none';
    case 'DRAG':
      return 'drag';
    case 'JOINT':
      return 'joint';
    case 'CREATE':
      return 'create';
    case 'EDIT':
      return 'edit';
    case 'FORCE':
      return 'force';
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
    case 'BREADBLOCK':
      return 'breadblock';
    // case 'ESCALATOR':
    //   return 'escalator';
    case 'SPRING':
      return 'spring';
    case 'HEATER':
      return 'heater';
    case 'WHEEL':
      return 'wheel';
    case 'FAN':
      return 'fan';
    default:
      return assertUnreachableChecker(eventType);
  }
};

export const getEventList = (eventName: EventName): EventType[] => {
  switch (eventName) {
    case 'MOUSE':
      return ['NONE', 'DRAG', 'JOINT', 'CREATE', 'EDIT'];
    case 'JOINT':
      return ['NONE', 'FORCE', 'SPRING', 'REVERSE', 'FIXED', 'HINGE'];
    case 'CREATE':
      return [
        'NONE',
        'CIRCLE',
        'RECTANGLE',
        'WATERBLOCK',
        'BACONBLOCK',
        'BREADBLOCK',
        // 'ESCALATOR',
        'SPRING',
        'HEATER',
        'WHEEL',
        'FAN',
      ];
    default:
      return assertUnreachableChecker(eventName);
  }
};

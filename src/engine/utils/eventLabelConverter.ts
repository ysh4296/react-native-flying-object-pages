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
    case 'SPRING':
      return 'spring';
    case 'MAGICIAN':
      return 'magician';
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
        // 'ESCALATOR',
        'MAGICIAN',
      ];
    default:
      return assertUnreachableChecker(eventName);
  }
};

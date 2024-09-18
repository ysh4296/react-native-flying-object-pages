export const layerStyles = {
  base: {
    border: '1px solid',
    borderColor: 'gray.700',
    borderRadius: ['sm', 'md', 'lg'],
    animationDelay: '100ms',
    transitionDelay: '100ms',
    transitionDuration: '300ms',
    _hover: {
      border: '1px solid',
      borderColor: 'gray.200',
      animationDelay: '100ms',
      transitionDelay: '100ms',
      transitionDuration: '300ms',
      borderRadius: ['lg', 'xl', '2xl'],
    },
  },
  selected: {
    border: '1px solid',
    borderColor: 'gray.200',
    borderRadius: ['lg', 'xl', '2xl'],
    _hover: {
      borderColor: 'red',
    },
  },
};

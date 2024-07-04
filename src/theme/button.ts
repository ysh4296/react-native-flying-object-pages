import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonStyle: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base',
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: [2, 3, 4], // responsive values
      py: [1, 2, 3], // responsive values
    },
    md: {
      fontSize: 'md',
      px: [3, 4, 5], // responsive values
      py: [2, 3, 4], // responsive values
    },
  },
  variants: {
    outline: {
      border: '2px solid',
      borderColor: ['purple.400', 'green.400', 'cyan.400'],
      color: ['purple.400', 'green.400', 'cyan.400'],
    },
    solid: {
      bg: 'purple.500',
      color: 'white',
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};

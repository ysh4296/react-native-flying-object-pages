import { ComponentStyleConfig } from '@chakra-ui/react';
import { colors } from './colors';

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
      borderColor: [colors.error[600], colors.error[700], colors.error[800]],
      color: [colors.primary[500], colors.primary[600], colors.primary[800]],
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

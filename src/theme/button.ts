import { ComponentStyleConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { layerStyles } from './layerStyle';

export const ButtonStyle: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
      color: [colors.primary[500], colors.primary[600], colors.primary[800]],
      ...layerStyles.base,
    },
    solid: {
      bg: 'purple.500',
      ...layerStyles.base,
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};

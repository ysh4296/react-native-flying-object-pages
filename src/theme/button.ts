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
    lg: {
      fontSize: '3xl',
      px: [4, 5, 6], // responsive values
      py: [3, 4, 5], // responsive values
    },
  },
  variants: {
    outline: {
      color: 'gray.500', // 희미한 텍스트 색상
      ...layerStyles.base,
      _hover: {
        bg: 'gray.100', // 은은한 배경색
      },
    },
    solid: {
      bg: colors.primary[500], // 강조된 색상
      ...layerStyles.base,
      _hover: {
        bg: colors.primary[600], // 살짝 더 어두운 호버 효과
      },
    },
    icon: {
      fontSize: '2xl',
      px: 0,
      py: 0,
      transitionDelay: '100ms',
      _hover: {
        bg: 'gray.200',
        transitionDelay: '100ms',
      },
    },
    activePath: {
      bg: colors.primary[600], // 강조된 색상
      color: 'white', // 텍스트는 대비되는 색상
      border: '2px solid',
      borderColor: colors.primary[900], // 더 어두운 색상으로 테두리 강조
      _hover: {
        bg: colors.primary[700], // 살짝 더 어두운 호버 효과
      },
    },
    inactivePath: {
      bg: 'gray.100', // 은은한 배경색
      color: 'gray.500', // 희미한 텍스트 색상
      border: '1px solid',
      borderColor: 'gray.300', // 미묘한 테두리 색상
      _hover: {
        bg: 'gray.200', // 미세한 호버 효과
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};

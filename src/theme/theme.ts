import { extendTheme } from '@chakra-ui/react';
import { fonts } from '@theme/fonts';
import { breakpoints } from '@theme/breakpoints';
import { ButtonStyle } from '@theme/button';
import { colors } from '@theme/colors';
import { layerStyles } from './layerStyle';
import { textStyles } from './textStyles';

export const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  fonts: {
    heading: fonts.pretendard.style.fontFamily,
    body: fonts.pretendard.style.fontFamily,
  },
  colors: colors,
  components: {
    Button: ButtonStyle,
  },
  breakpoints: breakpoints,
  layerStyles,
  textStyles,
});

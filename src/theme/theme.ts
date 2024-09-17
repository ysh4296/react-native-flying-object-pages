import { extendTheme } from '@chakra-ui/react';
import { fonts } from '@theme/fonts';
import { breakpoints } from '@theme/breakpoints';
import { ButtonStyle } from '@theme/button';
import { colors } from '@theme/colors';
import { layerStyles } from './layerStyle';

export const theme = extendTheme({
  fonts: {
    heading: fonts.bungee.style.fontFamily,
    body: fonts.pretendard.style.fontFamily,
  },
  colors: colors,
  components: {
    Button: ButtonStyle,
  },
  breakpoints: breakpoints,
  layerStyles,
});

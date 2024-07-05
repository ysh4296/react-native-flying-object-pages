import { extendTheme } from '@chakra-ui/react';
import { fonts } from 'app/fonts/fonts';
import { breakpoints } from '@theme/breakpoints';
import { ButtonStyle } from '@theme/button';
import { colors } from './colors';

export const theme = extendTheme({
  fonts: {
    heading: fonts.bungee.style.fontFamily,
    body: fonts.bungee.style.fontFamily,
  },
  colors: colors,
  components: {
    Button: ButtonStyle,
  },
  breakpoints: breakpoints,
});

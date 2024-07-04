import { extendTheme } from '@chakra-ui/react';
import { fonts } from 'app/fonts/fonts';
import { breakpoints } from '@theme/breakpoints';
import { ButtonStyle } from '@theme/button';

export const theme = extendTheme({
  fonts: {
    heading: fonts.bungee.style.fontFamily,
    body: fonts.bungee.style.fontFamily,
  },
  components: {
    Button: ButtonStyle,
  },
  breakpoints: breakpoints,
});

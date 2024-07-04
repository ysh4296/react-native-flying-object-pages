import { extendTheme } from '@chakra-ui/react';
import { fonts } from 'app/fonts/fonts';

export const theme = extendTheme({
  fonts: {
    heading: fonts.bungee.style.fontFamily,
    body: fonts.bungee.style.fontFamily,
  },
});

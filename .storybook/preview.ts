import type { Preview } from '@storybook/react';

const theme = require('../src/theme/theme');

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chakra: {
      theme,
    },
  },
};

export default preview;

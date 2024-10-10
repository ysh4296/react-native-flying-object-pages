'use client';

import { Box, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface SnackBoxProps {
  snackId: string;
}

const SnackBox = (props: SnackBoxProps) => {
  const { snackId } = props;
  const [isClient, setIsClient] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <></>;
  }

  return (
    <Box width="100%" borderRadius="md" border="1px solid" p={4}>
      <div
        data-snack-id={snackId}
        data-snack-platform="web"
        data-snack-preview="true"
        data-snack-theme={colorMode}
        style={{
          overflow: 'hidden',
          background: '#fbfcfd',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          height: '505px',
          width: '100%',
        }}
      />
      <script async src="https://snack.expo.dev/embed.js" />
    </Box>
  );
};

export default SnackBox;

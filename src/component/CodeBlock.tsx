'use client';

import { useColorMode } from '@chakra-ui/react';
import { CopyBlock, a11yDark, a11yLight } from 'react-code-blocks';

interface CodeBlockProps {
  text: any;
  properties: any;
}

const CodeBlock = (props: CodeBlockProps) => {
  const { text, properties } = props;
  const { colorMode } = useColorMode();
  return (
    <CopyBlock
      {...properties}
      text={text}
      theme={colorMode === 'light' ? a11yLight : a11yDark}
      showLineNumbers
      language="jsx"
    />
  );
};

export default CodeBlock;

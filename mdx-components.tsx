import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';
import code from 'content/code';
import SnackBox from '@component/SnackBox';
import CodeBlock from '@component/CodeBlock';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      return (
        <Text textStyle="h1" p={2}>
          {children}
        </Text>
      );
    },
    h2: ({ children }) => {
      return (
        <Text textStyle="h2" p={2}>
          {children}
        </Text>
      );
    },
    h3: ({ children }) => {
      return (
        <Text textStyle="h3" p={2}>
          {children}
        </Text>
      );
    },
    p: ({ children }) => {
      return (
        <Text textStyle="p" p={1}>
          {children}
        </Text>
      );
    },
    ul: ({ children }) => {
      return <UnorderedList>{children}</UnorderedList>;
    },
    li: ({ children }) => {
      return <ListItem>{children}</ListItem>;
    },
    CopyBlock: (properties) => {
      return (
        <Box p={2} borderRadius="md" border="1px solid" overflowX="auto">
          {/** @ts-ignore */}
          <CodeBlock {...properties} text={code[properties.text]} />
        </Box>
      );
    },
    SnackBox: (properties) => {
      return <SnackBox {...properties} />;
    },
    ...components,
  };
}

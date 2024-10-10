import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';
import { CopyBlock } from 'react-code-blocks';
import code from 'content/code';
import SnackBox from '@component/SnackBox';

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
      // @ts-ignore
      return <CopyBlock {...properties} text={code[properties.text]} />;
    },
    SnackBox: (properties) => {
      return <SnackBox {...properties} />;
    },
    ...components,
  };
}

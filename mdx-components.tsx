import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';
import { CopyBlock } from 'react-code-blocks';
import code from 'content/code';
import SnackBox from '@component/SnackBox';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      return (
        <Text fontWeight={800} fontSize="3xl" p={2}>
          {children}
        </Text>
      );
    },
    h2: ({ children }) => {
      return (
        <Text fontWeight={700} fontSize="2xl" p={2}>
          {children}
        </Text>
      );
    },
    h3: ({ children }) => {
      return (
        <Text fontWeight={600} fontSize="xl" p={2}>
          {children}
        </Text>
      );
    },
    p: ({ children }) => {
      return (
        <Text fontWeight={400} fontSize="md" p={1}>
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

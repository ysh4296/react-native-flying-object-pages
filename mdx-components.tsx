import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      return (
        <Text fontWeight={800} fontSize="3xl">
          {children}
        </Text>
      );
    },
    h2: ({ children }) => {
      return (
        <Text fontWeight={700} fontSize="2xl">
          {children}
        </Text>
      );
    },
    h3: ({ children }) => {
      return (
        <Text fontWeight={600} fontSize="xl">
          {children}
        </Text>
      );
    },
    p: ({ children }) => {
      return (
        <Text fontWeight={400} fontSize="md">
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
    ...components,
  };
}

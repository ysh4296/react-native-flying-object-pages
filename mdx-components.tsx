import { ListItem, UnorderedList } from '@chakra-ui/react';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ul: ({ children }) => {
      return <UnorderedList>{children}</UnorderedList>;
    },
    li: ({ children }) => {
      return <ListItem>{children}</ListItem>;
    },
    ...components,
  };
}

// components/MDXContent.tsx
'use client';

import { MDXProvider } from '@mdx-js/react';
import { useMDXComponents } from '../../mdx-components';
import { useEffect, useState } from 'react';

const MDXContent = ({ path }: { path: string }) => {
  const [mdxComponent, setMdxComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const LoadMDX = async () => {
      const { compileMDX } = await import('next-mdx-remote/rsc');
      const { content: compiledContent } = await compileMDX({
        source: path,
        options: { parseFrontmatter: true },
        components: useMDXComponents(),
      });
      setMdxComponent(compiledContent);
    };

    LoadMDX();
  }, [path]);

  return <MDXProvider>{mdxComponent}</MDXProvider>;
};

export default MDXContent;

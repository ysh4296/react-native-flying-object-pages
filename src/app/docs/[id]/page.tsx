import { compileMDX } from 'next-mdx-remote/rsc';
import { JSXElementConstructor, ReactElement, Suspense } from 'react';

const MDXContent = ({
  content,
}: {
  content: ReactElement<any, string | JSXElementConstructor<any>>;
}) => {
  return <Suspense fallback={<p>Loading...</p>}>{content}</Suspense>;
};

const Docs = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/';

  let mdx;
  try {
    mdx = fs.readFileSync(rootDir + id + '.mdx', 'utf8');
  } catch {
    mdx = fs.readFileSync(rootDir + id + '/GettingStarted.md', 'utf8');
  }

  // MDX 컴파일
  const { content } = await compileMDX({ source: mdx });

  // 클라이언트 컴포넌트에 데이터를 전달
  return <MDXContent content={content} />;
};

export default Docs;

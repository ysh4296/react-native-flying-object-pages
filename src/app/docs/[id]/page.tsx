import { Box } from '@chakra-ui/react';
import MDXContent from '@component/MDXContent';

const Docs = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/';

  let path;
  try {
    path = fs.readFileSync(rootDir + id + '.mdx', 'utf8');
  } catch {
    path = fs.readFileSync(rootDir + 'Overview.mdx', 'utf8');
  }

  // 클라이언트 컴포넌트에 데이터를 전달
  return (
    <Box p={4}>
      <MDXContent path={path} />
    </Box>
  );
};

export default Docs;

'use client';

import { Text, Button, Link } from '@chakra-ui/react';
import { useParams } from 'next/navigation';

interface PathButtonProps {
  content: string;
}

const PathButton = (props: PathButtonProps) => {
  const { id } = useParams();

  return (
    <Link w="100%" href={`/docs/${props.content}`} _hover={{ textDecoration: 'none' }}>
      <Button w="100%" variant={id === props.content ? 'activePath' : 'inactivePath'}>
        <Text w="100%" textAlign="left">
          {props.content}
        </Text>
      </Button>
    </Link>
  );
};

export default PathButton;

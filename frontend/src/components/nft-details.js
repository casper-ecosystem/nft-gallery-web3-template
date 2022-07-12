import { Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import {
  useParams
} from "react-router-dom";

const NftDetails = ({ nfts }) => {
  const { id } = useParams();
  const selectedNft = nfts.find(n => n.id === id);

  if (!selectedNft) return null;

  return (
    <Flex bg="grey.100" w="100%" justifyContent="center" alignItems="center">
      <Flex
        justifyContent="center"
        alignItems="center"
        w="100%"
        maxW="1600px"
        minH="140px"
        p={['12px', '24px', '48px', '80px', '80px', '80px 160px']}
        direction="column"
        gap="24px"
      >
        <Center
          bg="grey.200"
          w="100%"
          maxW="600px"
          h="800px"
          borderRadius="20px"
        >
          NFT #{selectedNft.id}
        </Center>
        <Center
          bg="grey.200"
          w="100%"
          maxW="600px"
          h="400px"
          borderRadius="20px"
        >
          <Text fontSize='xs'>
            <pre>{JSON.stringify(selectedNft.metadata, null, 2)}</pre>
          </Text>
        </Center>
      </Flex>
    </Flex>
  );
};

export default NftDetails;

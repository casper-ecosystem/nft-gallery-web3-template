import React from "react";
import { Center, Flex, Heading, Text, Box, Button } from "@chakra-ui/react";

const Success = ({ nft }) => {
  console.log(nft);
  return (
    <Center bg="grey.100" minH="calc(100vh - 150px)">
      <Flex
        direction="column"
        alignItems="center"
        m={["24px", "24px 60px"]}
        gap="20px"
        w="100%"
      >
        <Center
          bgColor="grey.50"
          maxW="620px"
          w="100%"
          h="500px"
          rounded="20px"
        >
          Your Nft
        </Center>
        <Flex
          direction="column"
          alignItems="center"
          maxW="620px"
          w="100%"
          bg="grey.50"
          rounded="20px"
          gap="28px"
          textAlign="center"
          p="24px 32px"
        >
          <Heading>Pecunia non olet!</Heading>
          <Flex w="100%" justifyContent="space-between">
            <Flex gap="8px">
              <Text fontSize="12px" fontWeight="700">
                NFT ID:
              </Text>
              <Text fontSize="12px">{nft.id}</Text>
            </Flex>
            <Flex gap="8px">
              <Text fontSize="12px" fontWeight="700">
                NFT BATCH:
              </Text>
              <Text fontSize="12px">{nft.metadata.batch}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" w="100%" textAlign="left">
            <Text fontSize="12px">Owner</Text>
            <Box
              bg="grey.50"
              w="100%"
              h="40px"
              rounded="5px"
              border="1px"
              borderColor="grey.100"
            ><Text fontSize="12px">{nft.owner}</Text></Box>
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
};

export default Success;

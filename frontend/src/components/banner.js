import React from 'react';
import { Flex, VStack, Text, Heading, HStack, Center } from '@chakra-ui/react';
import CountUp from 'react-countup';

const Banner = ({ numOfNfts }) => {
  return (
    <Flex bg="grey.100" w="100%" justifyContent="center">
      <Flex
        w="100%"
        maxW="1600px"
        // maxH={[null, null, '740px']}
        p={['12px', '24px', '48px', '80px', '80px', '80px 160px']}
        gap={['12px', '20px', '40px', '80px']}
      >
        <VStack flex="1" alignItems="start" gap="20px">
          <Heading size="2xl">Your title</Heading>
          <Text align="left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
          <Center
            w={['100%', '100%', '330px']}
            p="20px"
            minH="200px"
            border="2px solid black"
            borderRadius="10px"
            alignSelf="center"
          >
            <Flex fontWeight="bold" direction="column" align="center" gap="8px">
              <HStack fontSize="6xl">
                <CountUp
                  start={0}
                  end={numOfNfts}
                  duration={5}
                  delay={1}
                  useEasing={true}
                />
                <Text>/ 100</Text>
              </HStack>
              <Text fontSize="sm">NFTs have been claimed!</Text>
            </Flex>
          </Center>
        </VStack>
        <Center flex="1">
          <Center bg="grey.200" w="100%" h="100%">
            Image
          </Center>
        </Center>
      </Flex>
    </Flex>
  );
};

export default Banner;

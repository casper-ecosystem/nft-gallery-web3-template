import React from "react";
import { Center, Flex, Heading, Text, Button } from "@chakra-ui/react";

const Error = ({ error, reset }) => {
  return (
    <Center bg="grey.100" minH="calc(100vh - 150px)">
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
        m={["24px", "24px 60px"]}
      >
        <Heading>Error</Heading>
        <Center bg="grey.100" w="100%" maxW="300px" h="200px">
          {error}
        </Center>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore.
        </Text>
        <Button onClick={reset} bgColor="grey.100" w="100%">
          Start over
        </Button>
      </Flex>
    </Center>
  );
};

export default Error;

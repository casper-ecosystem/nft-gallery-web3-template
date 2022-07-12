import React, { useState } from "react";
import {
  Center,
  Flex,
  Heading,
  Input,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";

const Form = ({ signerAccountHash, submitOnClick }) => {
  const [ code, setCode ] = useState("");
  const [ email, setEmail ] = useState("");

  return (
    <>
      <Center bg="grey.100" minH="calc(100vh - 150px)">
        <Flex
          direction="column"
          maxW="620px"
          bg="grey.50"
          rounded="20px"
          gap="28px"
          textAlign="center"
          p="24px 32px"
          m={["24px", "24px 60px"]}
        >
          <Heading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit?
          </Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Text>
          <Flex direction="column" fontSize="12px" gap="16px">
            <Flex textAlign="left" direction="column">
              <Box textAlign="left">Redeem code</Box>
              <Input onChange={e => setCode(e.target.value)} value={code}></Input>
            </Flex>
            <Flex textAlign="left" direction="column">
              <Box textAlign="left">E-mail</Box>
              <Input onChange={e => setEmail(e.target.value)} value={email}></Input>
            </Flex>
            <Flex textAlign="left" direction="column">
              <Box textAlign="left">Your Account Hash</Box>
              <Input disabled value={signerAccountHash}></Input>
            </Flex>
            <Button bg="grey.150" onClick={() => submitOnClick(email, code)}>Redeem</Button>
          </Flex>
        </Flex>
      </Center>
    </>
  );
};

export default Form;

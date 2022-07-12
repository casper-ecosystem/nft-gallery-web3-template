import React from 'react';
import { Center, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Flex bg="grey.150" w="100%" justifyContent="center" alignItems="center">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        maxW="1600px"
        minH="140px"
        p={['0 12px', '0 24px', '0 48px', '0 80px', '0 80px', '0 160px']}
      >
        <Flex
          gap={['20px', '20px', '80px']}
          direction={['column', 'column', 'row']}
        >
          <Button variant="link" color="grey.400">
            Button
          </Button>
          <Button variant="link" color="grey.400">
            Button
          </Button>{' '}
          <Button variant="link" color="grey.400">
            Button
          </Button>
        </Flex>
        <Link to="/">
          <Center bg="grey" w="200px" h="100px" align="center">
            Image
          </Center>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Footer;

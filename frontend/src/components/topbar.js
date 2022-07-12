import React from 'react';
import { Center, Button, Flex } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Signer } from "casper-js-sdk";

const Topbar = ({ signerAccountHash }) => {
  const navigate = useNavigate();
  const isSigned = signerAccountHash !== null;

  return (
    <Flex
      bg="grey.50"
      w="100%"
      h="80px"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        maxW="1600px"
        p={['0 12px', '0 24px', '0 48px', '0 80px', '0 80px', '0 160px']}
      >
        <Link to="/">
          <Center bg="grey.150" w="200px" h="50px" align="center">
            Logo
          </Center>
        </Link>
        <Button onClick={isSigned ? () => navigate('/reedem') : Signer.sendConnectionRequest} bg="grey.200" w="120px" h="40px">
          {isSigned ? 'Reedem' : 'Sign in'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Topbar;

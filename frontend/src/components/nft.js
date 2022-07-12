import { Center, GridItem } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Nft = ({ data }) => {
  return (
    <GridItem cursor="pointer">
      <Link to={`/details/${data.id}`}>
        <Center bg="grey.150" w="100%" minH="300px" borderRadius="10px">
          NFT #{data.id}
        </Center>
      </Link>
    </GridItem>
  );
};

export default Nft;

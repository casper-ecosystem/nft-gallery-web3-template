import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import Nft from "./nft";

import { TOTAL_NFTS_NUM } from "../constants";

const Nfts = ({ nfts }) => {
  return (
    <Flex bg="gray.50" w="100%" justifyContent="center" alignItems="center">
      <Grid
        templateColumns={[
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(4, 1fr)",
          "repeat(5, 1fr)",
          "repeat(5, 1fr)",
        ]}
        gap={6}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        maxW="1600px"
        p={["12px", "24px", "48px", "80px", "80px", "80px 160px"]}
      >
        {nfts.map((nft, idx) => (
          <Nft key={`nft_${nft.id}`} data={nft} />
        ))}
      </Grid>
    </Flex>
  );
};

export default Nfts;

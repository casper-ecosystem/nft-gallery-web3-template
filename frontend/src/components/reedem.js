import React, { useState, useEffect } from "react";
import { Center, Flex, Heading, Text, Box, Button } from "@chakra-ui/react";

import { fetchStatus, submitTicket } from "../api";

import Form from "./form";
import Success from "./success";
// import Deploy from "./deploy";
import Error from "./error";
import Pending from "./pending";

// import Text from "../data/text.json";
// import Wrapper from "./wrapper";

const SCREENS = {
  PROMPT_SCREEN: "PROMPT_SCREEN",
  FORM_SCREEN: "FORM_SCREEN",
  SUCCESS_SCREEN: "SUCCESS_SCREEN",
  PENDING_SCREEN: "PENDING_SCREEN",
  ERROR_SCREEN: "ERROR_SCREEN",
};

const Prompt = ({ signerAccountHash, onClickProcess }) => {
  return (
    <>
      <Center bg="grey.100" minH="calc(100vh - 150px)">
        <Flex
          direction="column"
          alignItems="center"
          maxW="620px"
          bg="grey.50"
          rounded="20px"
          gap="28px"
          textAlign="center"
          p="24px 32px"
          m={["24px", "24px 60px"]}
        >
          <Heading>Lorem ipsum!</Heading>
          <Text>Signer account hash:</Text>
          <Box bg="grey.100" w="100%" h="40px" borderRadius="5px">
            {signerAccountHash}
          </Box>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Text>
          <Button bg="grey.100" onClick={onClickProcess}>
            Redeem
          </Button>
        </Flex>
      </Center>
    </>
  );
};

const Account = ({ width, signerAccountHash }) => {
  const [activeScreen, setActiveScreen] = useState(SCREENS.PROMPT_SCREEN);
  const [ownedNFT, setOwnedNFT] = useState(null);
  const [pendingDeploy, setPendingDeploy] = useState(null);
  const [error, setError] = useState(null);

  const getStatus = async () => {
    const { ok, val } = await fetchStatus(signerAccountHash);
    if (ok) {
      setOwnedNFT(val[0]);
      setError(null);
      setPendingDeploy(null);
      setActiveScreen(SCREENS.SUCCESS_SCREEN);
      return;
    }
    switch (val) {
      case "NOT_OWNED_TOKEN":
        setOwnedNFT(null);
        setError(null);
        setPendingDeploy(null);
        setActiveScreen(SCREENS.PROMPT_SCREEN);
        break;
      case "PENDING_DEPLOY":
        setOwnedNFT(null);
        setError(null);
        setActiveScreen(SCREENS.PENDING_SCREEN);
        break;
      default:
        setOwnedNFT(null);
        setError(val);
        setActiveScreen(SCREENS.ERROR_SCREEN);
        break;
    }
  };

  const submitFetch = async (email, code) => {
    const { ok, val } = await submitTicket(email, code, signerAccountHash)
    if (ok && val) {
      setPendingDeploy(val);
      getStatus();
    } else {
      setError(val);
    }
  }

  const resetError = () => {
    getStatus();
  }

  useEffect(() => {
    getStatus();
  }, [signerAccountHash]);

  if (!activeScreen) {
    return null;
  }

  if (ownedNFT) {
    return <Success nft={ownedNFT} />
  }

  if (error) {
    return <Error error={error} reset={resetError} />;
  }

  switch (activeScreen) {
    case SCREENS.PROMPT_SCREEN:
      return (
        <Prompt
          width={width}
          signerAccountHash={signerAccountHash}
          onClickProcess={() => setActiveScreen(SCREENS.FORM_SCREEN)}
        />
      );
    case SCREENS.PENDING_SCREEN:
      return <Pending />;
      {
        /* <Deploy width={width} getStatus={getStatus} hash={pendingDeploy} />; */
      }
    case SCREENS.FORM_SCREEN:
      return <Form signerAccountHash={signerAccountHash} submitOnClick={submitFetch}/>;
    default:
      return null;
  }
};

export default Account;

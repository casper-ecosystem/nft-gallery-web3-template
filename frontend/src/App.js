import React, { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { CLPublicKey } from 'casper-js-sdk';

import Topbar from './components/topbar';
import Banner from './components/banner';
import Nfts from './components/nfts';
import Reedem from './components/reedem';
import Footer from './components/footer';
import { SignerScreen, SignerConnector } from "./components/signer";

import { fetchAllNFTs } from "./api";

import { mainTheme } from './style/theme';
import NftDetails from './components/nft-details';

function App() {
  const [nfts, setNfts] = useState([]);
  const [signerAccountHash, setAccountHash] = useState(null);

  useEffect(() => {
    fetchAllNFTs().then(setNfts);
  }, []);
  
  const setSignerAccountHash = (publicKey) => {
    if (publicKey) {
      const hash = CLPublicKey.fromHex(publicKey).toAccountHashStr().slice(13);
      setAccountHash(hash);
    } else {
      setAccountHash(null);
    }
  };

  return (
    <ChakraProvider theme={mainTheme}>
      <SignerConnector setSignerAccountHash={setSignerAccountHash} />
      <Topbar signerAccountHash={signerAccountHash} />
      <Routes>
        <Route
          path="/"
          exact
          element={
            <>
              <Banner numOfNfts={nfts.length} />
              <Nfts nfts={nfts} />
            </>
          }
        />
        <Route path="/details/:id" element={<NftDetails nfts={nfts} />} />
        <Route path="/reedem/" element={<Reedem signerAccountHash={signerAccountHash} />} />
      </Routes>
      <Footer />
    </ChakraProvider>
  );
}

export default App;

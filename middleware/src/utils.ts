import { Ok, Err, Result } from 'ts-results';
import { decodeBase64, Keys } from 'casper-js-sdk';

import { ERROR_CODES, KEY_VARIANTS } from './constants';

export const toJS = <R>(r: Result<R, ERROR_CODES>) => {
  const { ok, val } = r;
  return { ok, val };
};

export const getKeysFromHexPrivKey = (
  key: string,
  variant: KEY_VARIANTS,
): Keys.AsymmetricKey => {
  console.log(key, variant);
  const rawPrivKeyBytes = decodeBase64(key);
  let keyPair;

  if (variant === KEY_VARIANTS.SECP256K1) {
    const privKey = Keys.Secp256K1.parsePrivateKey(rawPrivKeyBytes);
    const pubKey = Keys.Secp256K1.privateToPublicKey(privKey);
    keyPair = new Keys.Secp256K1(pubKey, privKey);
  }

  if (variant === KEY_VARIANTS.ED25519) {
    const privKey = Keys.Ed25519.parsePrivateKey(rawPrivKeyBytes);
    const pubKey = Keys.Ed25519.privateToPublicKey(privKey);
    keyPair = Keys.Ed25519.parseKeyPair(pubKey, privKey);
  }

  console.log(`Public key hex: ${keyPair.publicKey.toHex()}`);

  return keyPair;
};

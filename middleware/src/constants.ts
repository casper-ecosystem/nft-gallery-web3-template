export enum ERROR_CODES {
  NoOwned = 'NOT_OWNED_TOKEN',
  AlreadyOwned = 'ALREADY_OWNED',
  PendingDeploy = 'PENDING_DEPLOY',
  WrongTicket = 'WRONG_TICKET',
  UsedTicket = 'USED_TICKET',
  InvalidDeploy = 'INVALID_DEPLOY',
  AllNftsUsed = 'NO_MORE_NFTS',
  NftNotFoundOnChain = 'MISSING_NFT_ON_CHAIN',
}

export enum KEY_VARIANTS {
  ED25519,
  SECP256K1,
}

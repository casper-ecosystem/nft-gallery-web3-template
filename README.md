## Casper NFT Redeem App (CEP47)

### Middleware

Middleware acts as a proxy between the frontend and Casper network.
It also has a persistence layer (MongoDB) which caches some data, so it's not required to query the network on every user visit.
Instead, the middleware listens to events related to the provided contract (so it knows when the owner of NFT changed).
It is worth mentioning that the current version of middleware assumes that all NFTs are minted UPFRONT, so it just transfers it from one owner (in this case, the account that middleware has access to) to another.


### Frontend

Frontend allows the end-user to browse through the transferred NFTs and redeem the email/code pair.
It also connects to Signer to ensure that the user has properly generated private/public keys.


## How to run the example

1. Install CEP47 contract using [official CasperLabs CEP47-js-client](https://github.com/casper-network/casper-contracts-js-clients).
2. Mint the series of NFTs using following metadata (it can be easily changed in `middleware/src/schemas/nft.schema.ts` according to your needs) and using CEP47-js-client.
```
  description: string;
  external_url: string;
  image: string;
  name: string;
  batch: string;
```

3. Set the `.env` in an app:
```
# DEV SETUP
MIDDLEWARE_PORT=4000
MIDDLEWARE_URL=http://0.0.0.0:4000/app
MONGO_URL=mongodb:27017

MONGO_DB_NAME=tigers
MONGO_USERNAME=tiger_user
MONGO_PASSWORD=tiger_pass

# CHAIN SETUP
CHAIN_RPC_URL= # RPC URL
CHAIN_NET_NAME= # NETWORK NAME
CHAIN_EE_URL= # EVENT STREAM URL
CHAIN_CONTRACT_ADDR= # CONTRACT HASH
CHAIN_CONTRACT_PACKAGE_ADDR= # CONTRACT PACKAGE HASH
CHAIN_PRIV_KEY_VARIANT= # TWO VALID OPTIONS: ED25519 or SECP256K1
CHAIN_PRIV_KEY_BASE64= # ONE LINE PRIVATE KEY BASE64 REPRESENTATION (for example from `casper-client-rs`) eg. `MC4CAQAwBQYDK2VwBCIEIOPkC3OAuMmsclduN3d/i9cYxP2sNzl1/FWWFhJxeLS5`
TOTAL_NFTS_NUM= # TOTAL NUMBER OF MINTED NFTs
```

4. Build the up running `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build`
5. Start the app by running `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
and it will query the specified contract and put all of the data about minted NFTs from it and save it into a database.
6. The API is available over `localhost:4000/app` and the frontend `localhost:3000`.
7. To use the app, you will also need to put submissions into the database. Example submission containing `100` submission tickets in the `example/tickets.json` directory. We recommend doing this manually by MONGODB CLI.

## Feedback and contribution

Please use either issues tab in this repository or fork the repo and create PRs for approval. We intend to make this project driven by the community's requests, and any open source contributions are welcome.

## TODO

[ ] - App should be able to mint new nfts


import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Ok, Err, Result } from 'ts-results';
import { InjectModel } from '@nestjs/mongoose';

import {
  CasperClient,
  EventStream,
  EventName,
  CLValueBuilder,
  CLPublicKey,
  CLAccountHash,
  Keys,
} from 'casper-js-sdk';
import {
  CEP47Client,
  CEP47Events,
  CEP47EventParser,
} from 'casper-cep47-js-client';

import { Deploy, DeployDocument, DEPLOY_STATUS } from './schemas/deploy.schema';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { NFT, NFTDocument } from './schemas/nft.schema';
import { getKeysFromHexPrivKey } from './utils';
import { KEY_VARIANTS, ERROR_CODES } from './constants';

const {
  CHAIN_RPC_URL,
  CHAIN_NET_NAME,
  CHAIN_EE_URL,
  CHAIN_CONTRACT_ADDR,
  CHAIN_CONTRACT_PACKAGE_ADDR,
  CHAIN_PRIV_KEY_VARIANT,
  CHAIN_PRIV_KEY_BASE64,
} = process.env;

@Injectable()
export class CasperService {
  private casperClient: CasperClient;
  private contractClient: CEP47Client;
  private eventStream: EventStream;
  private keyPair: Keys.AsymmetricKey;
  private pendingHashes = [];

  constructor(
    @InjectModel(Deploy.name) private deployModel: Model<DeployDocument>,
    @InjectModel(NFT.name) private nftModel: Model<NFTDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {
    this.casperClient = new CasperClient(CHAIN_RPC_URL);
    this.contractClient = new CEP47Client(CHAIN_RPC_URL, CHAIN_NET_NAME);
    this.eventStream = new EventStream(CHAIN_EE_URL);

    this.contractClient.setContractHash(
      CHAIN_CONTRACT_ADDR,
      CHAIN_CONTRACT_PACKAGE_ADDR,
    );

    this.keyPair = getKeysFromHexPrivKey(
      CHAIN_PRIV_KEY_BASE64,
      KEY_VARIANTS[CHAIN_PRIV_KEY_VARIANT],
    );

    const bootstrapPendingDeploys = async () => {
      const list = await this.deployModel
        .find({ status: DEPLOY_STATUS.Pending })
        .exec();
      list.forEach(
        (d) =>
          d.status === DEPLOY_STATUS.Pending && this.pendingHashes.push(d.hash),
      );
    };

    bootstrapPendingDeploys();



    this.eventStream.subscribe(EventName.DeployProcessed, async (event) => {
      const { deploy_hash, execution_result } = event.body.DeployProcessed;

      if (this.pendingHashes.includes(deploy_hash)) {
        if (execution_result.Success) {
          this.pendingHashes = this.pendingHashes.filter(
            (a) => a !== deploy_hash,
          );
          await this.deployModel.update(
            { hash: deploy_hash },
            { $set: { status: DEPLOY_STATUS.Succeeded } },
          );
        } else {
          const deploy = await this.deployModel.findOne({ 
            hash: deploy_hash
          });
          deploy.status = DEPLOY_STATUS.Failed;
          await deploy.save();
          const ticket = await this.ticketModel.findOne({ deploys: deploy });
          ticket.isUsed = false;
          await ticket.save();
        }
      }

      const parsedEvents = CEP47EventParser(
        {
          contractPackageHash: CHAIN_CONTRACT_PACKAGE_ADDR,
          eventNames: [CEP47Events.TransferToken],
        },
        event,
      );

      if (parsedEvents && parsedEvents.success) {
        parsedEvents.data.forEach(async (parsedEvent) => {
          if (parsedEvent.name === CEP47Events.TransferToken) {
            const { clValue } = parsedEvent;

            const deployRecepientHashRaw = clValue
              .get(CLValueBuilder.string('recipient'))
              .value()
              .slice(13, -1);

            const deployTokenId = clValue
              .get(CLValueBuilder.string('token_id'))
              .value();

            await this.nftModel.updateOne(
              { id: deployTokenId },
              {
                owner: `account-hash-${deployRecepientHashRaw}`,
                blocked: false,
              },
            );

            console.log('Transfered token: ', deployTokenId);
            console.log('Transfered token recipient: ', deployRecepientHashRaw);
          }
        });
      }
    });

    this.eventStream.start();
  }

  public publicKey(): CLPublicKey {
    return this.keyPair.publicKey;
  }

  async listNfts(ids: string[]): Promise<Result<any[], ERROR_CODES>> {
    const allAsyncResults = [];

    for (const id of ids) {
      try {
        const meta = await this.contractClient.getTokenMeta(`${id}`);
        const owner = await this.contractClient.getOwnerOf(`${id}`);
        allAsyncResults.push({ metadata: Object.fromEntries(meta), id, owner });
      } catch (e) {
        console.error(`Error while querying ${id}`, e);
      }
    }

    if (allAsyncResults.length !== ids.length) {
      return Err(ERROR_CODES.NftNotFoundOnChain);
    }

    return Ok(allAsyncResults);
  }

  async transferNFT(
    nft: NFT,
    recipient: string,
  ): Promise<Result<string, ERROR_CODES>> {
    const buffer = Buffer.from(recipient.split('-')[2], 'hex');
    const recipientAH = new CLAccountHash(buffer);

    const deploy = await this.contractClient.transfer(
      recipientAH,
      [nft.id],
      '2000000000',
      this.keyPair.publicKey,
      [this.keyPair],
    );

    try {
      const hash = await deploy.send(CHAIN_RPC_URL);
      this.pendingHashes.push(hash);
      return Ok(hash);
    } catch (err) {
      console.error(err);
      return Err(ERROR_CODES.InvalidDeploy);
    }
  }
}

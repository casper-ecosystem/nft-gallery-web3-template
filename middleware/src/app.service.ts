import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ok, Err, Result } from 'ts-results';

import { NFT, NFTDocument } from './schemas/nft.schema';
import { Deploy, DeployDocument, DEPLOY_STATUS } from './schemas/deploy.schema';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { TicketSubmitDto } from './types';
import { ERROR_CODES } from './constants';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(NFT.name) private nftModel: Model<NFTDocument>,
    @InjectModel(Deploy.name) private deployModel: Model<DeployDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async getAllNFTs(serverPKHash): Promise<NFT[]> {
    return this.nftModel.find({ owner: { $ne: serverPKHash } }).exec();
    // const all = await this.nftModel.find().exec();
    // const result = all.map((n) => (n.owner === serverPKHash ? null : n));
    // return result;
  }

  async setOrUpdateNFTs(nfts: any) {
    const bulkArr = [];

    for (const n of nfts) {
      bulkArr.push({
        updateOne: {
          filter: { id: n.id },
          update: n,
          upsert: true,
        },
      });
    }

    return await this.nftModel.bulkWrite(bulkArr);
  }

  async checkStatus(accountHash: string): Promise<Result<NFT[], ERROR_CODES>> {
    const ownedNfts = await this.nftModel.find({ owner: accountHash }).exec();

    const relatedPendingDeploys = await this.deployModel
      .find({
        accountHash,
        status: DEPLOY_STATUS.Pending,
      })
      .exec();

    if (relatedPendingDeploys.length) {
      return Err(ERROR_CODES.PendingDeploy);
    }

    if (!ownedNfts.length) {
      return Err(ERROR_CODES.NoOwned);
    }

    return Ok(ownedNfts);
  }

  async findFreeNFT(
    ticketSubmitDto: TicketSubmitDto,
    serverAccountHash: string,
  ): Promise<Result<[NFTDocument, TicketDocument], ERROR_CODES>> {
    const { code, email, accountHash } = ticketSubmitDto;

    const ticket = await this.ticketModel
      .findOne({ code, email })
      .populate('deploys')
      .exec();

    // Check if ticket is valid
    if (!ticket) {
      return Err(ERROR_CODES.WrongTicket);
    }

    // Check if ticket is used or in progress
    if (
      ticket &&
      (ticket.isUsed ||
      ticket.deploys.some(
        (d) =>
          d.status === DEPLOY_STATUS.Pending ||
          d.status === DEPLOY_STATUS.Succeeded,
      ))
    ) {
      return Err(ERROR_CODES.UsedTicket);
    }

    ticket.isUsed = true;
    ticket.save();

    const ownedNFTs = await this.nftModel.find({ owner: accountHash }).exec();

    // Checks if the account already owns NFTs
    if (ownedNFTs.length) {
      ticket.isUsed = false;
      ticket.save();
      return Err(ERROR_CODES.AlreadyOwned);
    }

    const relatedPendingDeploys = await this.deployModel
      .find({
        status: DEPLOY_STATUS.Pending,
        accountHash,
      })
      .exec();

    // Check if there a deploy sent using this PK & from this site that is still in progress
    // TODO: Possible can be removed
    if (relatedPendingDeploys.length) {
      ticket.isUsed = false;
      ticket.save();
      return Err(ERROR_CODES.PendingDeploy);
    }

    // Collect all unused NFTs
    const freeNFTs = await this.nftModel
      .find({ blocked: false, owner: serverAccountHash })
      .exec();
    const drawIndex = Math.floor(Math.random() * freeNFTs.length);
    const drawnNFT = await this.nftModel
      .findOne({ blocked: false, owner: serverAccountHash })
      .skip(drawIndex)
      .exec();

    if (drawnNFT) {
      drawnNFT.blocked = true;
      await drawnNFT.save();
    } else {
      ticket.isUsed = false;
      ticket.save();
      return Err(ERROR_CODES.AllNftsUsed);
    }

    return Ok([drawnNFT, ticket]);
  }

  addDeploy(hash: string, accountHash: string, nftId: string) {
    const newDeploy = new this.deployModel({ hash, accountHash, nftId });
    return newDeploy.save();
  }
}

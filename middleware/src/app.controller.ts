import { Controller, Get, Param, Body, Patch } from '@nestjs/common';
import { Ok, Err, Result } from 'ts-results';

import { AppService } from './app.service';
import { CasperService } from './casper.service';
import { NFT } from './schemas/nft.schema';
import { TicketSubmitDto } from './types';
import { ERROR_CODES } from './constants';
import { toJS } from './utils';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly casperService: CasperService,
  ) {
    const bootstrap = async () => {
      const ids = Array.from(Array(100).keys()).map((i) => `${i + 1}`);
      const allNFTs = await this.casperService.listNfts(ids);
      this.appService.setOrUpdateNFTs(allNFTs);
    };

    bootstrap();
  }

  @Get()
  async getAllNFTs(): Promise<NFT[]> {
    const serverPKHash = this.casperService.publicKey().toAccountHashStr();
    return this.appService.getAllNFTs(serverPKHash);
  }

  @Get('status/:accountHash')
  async findOwned(@Param() params) {
    const { accountHash } = params;
    return toJS(await this.appService.checkStatus(accountHash));
  }

  @Patch()
  async transfer(@Body() ticketSubmitDto: TicketSubmitDto) {
    const { accountHash } = ticketSubmitDto;
    const serverPublicKey = this.casperService.publicKey();
    const maybeNFT = await this.appService.findFreeNFT(
      ticketSubmitDto,
      serverPublicKey.toAccountHashStr(),
    );

    if (maybeNFT.ok) {
      const [nft, ticket] = maybeNFT.unwrap();
      nft.blocked = true;
      nft.save();
      const maybeHash = await this.casperService.transferNFT(nft, accountHash);

      if (maybeHash.ok) {
        const hash = maybeHash.unwrap();
        // TODO: add deploy
        const deploy = await this.appService.addDeploy(
          hash,
          accountHash,
          nft.id,
        );
        ticket.deploys.push(deploy);
        ticket.save();
      } else {
        nft.blocked = false;
        nft.save();
        ticket.isUsed = false;
        ticket.save();
      }
      return toJS(maybeHash);
    } else {
      return toJS(maybeNFT);
    }
  }
}

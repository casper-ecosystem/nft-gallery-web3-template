import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CasperService } from './casper.service';
// import { DeploysService } from './deploys/deploys.service';

import { NFT, NFTSchema } from './schemas/nft.schema';
import { Deploy, DeploySchema } from './schemas/deploy.schema';
import { Ticket, TicketSchema } from './schemas/ticket.schema';

const DB_URL = `mongodb://${process.env.MONGO_URL}`;
const isProduction = process.env.NODE_ENV === "production";

console.log("Database URL: ", DB_URL);
console.log("Database URL: ", DB_URL);
console.log("isProduction: ", isProduction);

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_URL, {
      dbName: process.env.DB_NAME,
      ssl: isProduction,
      sslValidate: isProduction,
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      sslCA: isProduction ? `${__dirname}/cert.pem` : null
    }),
    MongooseModule.forFeature([
      { name: NFT.name, schema: NFTSchema },
      { name: Deploy.name, schema: DeploySchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [CasperService, AppService],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeployDocument = Deploy & Document;

export enum DEPLOY_STATUS {
  'Pending',
  'Succeeded',
  'Failed',
}

@Schema()
export class Deploy {
  @Prop()
  hash: string;

  @Prop()
  publicKey: string;

  @Prop()
  accountHash: string;

  @Prop()
  nftId: string;

  @Prop({ default: new Date() })
  date: Date;

  @Prop({ default: DEPLOY_STATUS.Pending })
  status: DEPLOY_STATUS;
}

export const DeploySchema = SchemaFactory.createForClass(Deploy);

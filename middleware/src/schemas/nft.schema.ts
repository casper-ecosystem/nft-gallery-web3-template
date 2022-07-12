import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NFTDocument = NFT & Document;

interface NFTMetadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  batch: string;
}

@Schema()
export class NFT {
  @Prop()
  id: string;

  @Prop()
  owner: string;

  @Prop({
    type: raw({
      description: { type: String },
      external_url: { type: String },
      image: { type: String },
      name: { type: String },
      batch: { type: String },
    }),
  })
  metadata: NFTMetadata;

  @Prop({ default: false })
  blocked: boolean;
}

export const NFTSchema = SchemaFactory.createForClass(NFT);

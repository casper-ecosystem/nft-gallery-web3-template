import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Deploy } from './deploy.schema';

export type TicketDocument = Ticket & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Ticket {
  @Prop()
  email: string;

  @Prop()
  code: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deploy' }] })
  deploys: Deploy[];

  @Prop({ default: false })
  isUsed: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

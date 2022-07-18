import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@ObjectType()
@Schema({ strict: true })
export class RevokedToken {
  @Field()
  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Field()
  @Prop({ type: String, required: true })
  token: string;
}

const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken)
    .set('validateBeforeSave', false)
    .set('bufferCommands', false)
    .set('autoCreate', false);

RevokedTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export { RevokedTokenSchema };
export type RevokedTokenDocument = RevokedToken & mongoose.Document;

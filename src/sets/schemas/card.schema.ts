import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ strict: true })
export class Card {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field()
  @Prop({ type: String, required: true })
  term: string;

  @Field()
  @Prop({ type: String, required: true })
  description: string;
}
export const CardSchema = SchemaFactory.createForClass(Card)
    .set('validateBeforeSave', false)
    .set('bufferCommands', false)
    .set('autoCreate', false);

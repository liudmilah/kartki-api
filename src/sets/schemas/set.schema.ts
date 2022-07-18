import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Card, CardSchema } from './card.schema';
import { User } from '../../auth/schemas/user.schema';

@ObjectType()
@Schema({ strict: true })
export class Set {
    @Field(() => ID, { nullable: true })
    _id: string;

    @Field()
    @Prop({ type: String, required: true })
    name: string;

    @Field()
    @Prop({ type: Date, default: Date.now })
    created?: string;

    @Field()
    @Prop({ type: String })
    description?: string;

    @Field(() => User)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    author: User;

    @Field(() => [Card])
    @Prop({ type: [CardSchema], default: [] })
    cards: Card[];

    @Field(() => Number)
    @Prop({ type: Number, required: true })
    cardsAmount: number;
}

export const SetSchema = SchemaFactory.createForClass(Set)
    .set('validateBeforeSave', false)
    .set('bufferCommands', false)
    .set('autoCreate', false)
    .index({ author: 1, name: 1 });

export type SetDocument = Set & mongoose.Document;

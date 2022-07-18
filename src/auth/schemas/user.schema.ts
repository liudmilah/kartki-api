import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@ObjectType()
@Schema({ strict: true })
export class User {
    @Field(() => ID, { nullable: true })
    _id: string;

    @Field()
    @Prop({ type: String, required: true })
    status: string;

    @Field()
    @Prop({ type: String, required: true })
    name: string;

    @Field()
    @Prop({ type: String })
    email?: string;

    @Field()
    @Prop()
    passwordHash?: string;

    @Field()
    @Prop()
    googleId?: string;

    @Field()
    @Prop()
    facebookId?: string;

    @Field()
    @Prop()
    signupConfirmTokenValue?: string;

    @Field()
    @Prop({ type: Date })
    signupConfirmTokenExpires?: Date;

    @Field()
    @Prop({ type: Date, default: Date.now })
    created: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)
    .set('validateBeforeSave', false)
    .set('bufferCommands', false)
    .set('autoCreate', false);

export type UserDocument = User & mongoose.Document;

import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ObjectType({ description: 'tokens ' })
export class AuthTokens {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    accessToken: string;

    @Field({ nullable: true })
    @IsUUID()
    refreshToken?: string;
}
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupConfirmInput {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    token: string;
}
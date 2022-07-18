import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

@InputType()
export class SignupRequestInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @Field()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;
}
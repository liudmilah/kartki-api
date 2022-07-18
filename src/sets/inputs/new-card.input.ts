import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class NewCardInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    term: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    description: string;
}

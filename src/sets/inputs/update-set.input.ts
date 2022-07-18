import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { NewSetInput } from './new-set.input';

@InputType()
export class UpdateSetInput extends PartialType(NewSetInput) {
    @Field()
    @IsString()
    @IsNotEmpty()
    _id: string;
}

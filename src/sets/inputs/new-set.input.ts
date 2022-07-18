import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { NewCardInput } from './new-card.input';

@InputType()
export class NewSetInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @Field()
    @IsString()
    @Length(0, 500)
    description?: string;

    @Field(() => [NewCardInput])
    @ValidateNested()
    cards: NewCardInput[];
}

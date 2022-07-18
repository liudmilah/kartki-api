import { Token } from './token';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Tokenizer {
    constructor(
        private configService: ConfigService,
    ) {}

    public generate(date: Date): Token {
        return new Token(uuidv4(), new Date(date.getTime() + 1000 * this.configService.get<number>('auth.userTokenTtl')));
    }
}

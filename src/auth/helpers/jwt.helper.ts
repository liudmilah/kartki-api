import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Jwt {
    constructor(private readonly jwtService: JwtService) {}

    public encode(payload: Record<string, any>): string {
        return this.jwtService.sign(payload);
    }

    public decode(token: string): Record<string, any> {
        return this.jwtService.verify(token);
    }
}

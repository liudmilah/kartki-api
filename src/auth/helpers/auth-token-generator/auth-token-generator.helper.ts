import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Jwt } from '../jwt.helper';
import { User } from '../../schemas/user.schema';
import { AccessToken } from './access-token';
import { RefreshToken } from './refresh-token';

@Injectable()
export class AuthTokenGenerator {
    constructor(private readonly jwt: Jwt, private configService: ConfigService) {}

    public generateAccessToken(user: User): AccessToken {
        const token = new AccessToken(this.jwt);
        return token
            .setUserId(user._id)
            .setUserName(user.name)
            .setEmail(user.email)
            .setExpiredAt(Math.floor(Date.now() / 1000) + this.configService.get<number>('auth.accessTokenTtl'));
    }

    public generateRefreshToken(user: User): RefreshToken {
        const token = new RefreshToken(this.jwt);
        return token
            .setUserId(user._id)
            .setUserName(user.name)
            .setEmail(user.email)
            .setExpiredAt(Math.floor(Date.now() / 1000) + this.configService.get<number>('auth.refreshTokenTtl'));
    }

    public getAccessTokenFromString(tokenStr: string): AccessToken {
        const decoded = this.jwt.decode(tokenStr);
        const token = new AccessToken(this.jwt);
        return token
            .setUserId(decoded.userId)
            .setUserName(decoded.userName)
            .setEmail(decoded.email)
            .setExpiredAt(decoded.expiredAt);
    }
}

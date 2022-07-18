import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('auth.googleAppId'),
            clientSecret: configService.get<string>('auth.googleAppSecret'),
            callbackURL: `${configService.get<string>('frontendUrl')}/api/auth/google/cb`,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { displayName, emails, id } = profile;
        const user = {
            email: emails ? emails[0].value : '',
            name: displayName,
            googleId: id,
            accessToken,
        };

        done(null, user);
    }
}

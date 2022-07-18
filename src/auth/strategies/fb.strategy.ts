import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('auth.fbAppId'),
            clientSecret: configService.get<string>('auth.fbAppSecret'),
            callbackURL: `${configService.get<string>('frontendUrl')}/api/auth/facebook/cb`,
            profileFields: ['emails', 'displayName', 'id'],
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
            facebookId: id,
            accessToken,
        };

        done(null, user);
    }
}

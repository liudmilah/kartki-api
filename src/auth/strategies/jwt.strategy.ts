import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../schemas/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwtSecret'),
            passReqToCallback: true,
        });
    }

    async validate(req: any, validationPayload: { sub }): Promise<User> {
        const authHeader = req.headers['authorization'];
        const rawToken: string = authHeader ? authHeader.split(' ')[1] : '';

        const invalid = await this.authService.isTokenRevoked(rawToken);
        if (!invalid) {
            return await this.authService.findOneActiveById(validationPayload.sub);
        }

        throw new UnauthorizedException();
    }
}

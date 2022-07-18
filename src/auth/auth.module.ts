import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Tokenizer } from './helpers/tokenizer';
import { PasswordHasherHelper } from './helpers/password-hasher.helper';
import { UrlGeneratorHelper } from './helpers/url-generator.helper';
import { Jwt } from './helpers/jwt.helper';
import { AuthTokenGenerator } from './helpers/auth-token-generator';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { FacebookStrategy } from './strategies/fb.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokedToken, RevokedTokenSchema } from './schemas/revoked-token.schema';
import { User, UserSchema } from './schemas/user.schema';
import configuration from '../config/configuration';

const conf = configuration();

@Module({
    imports: [
        MailModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: conf.jwtSecret,
            signOptions: { expiresIn: '1800s' },
        }),
        MongooseModule.forFeature([
            { name: RevokedToken.name, schema: RevokedTokenSchema },
            { name: User.name, schema: UserSchema }
        ]),
    ],
    controllers: [AuthController],
    providers: [
        AuthResolver,
        AuthService,
        JwtStrategy,
        LocalStrategy,
        Tokenizer,
        AuthTokenGenerator,
        PasswordHasherHelper,
        Jwt,
        UrlGeneratorHelper,
        FacebookStrategy,
        GoogleStrategy,
    ],
})
export class AuthModule {}

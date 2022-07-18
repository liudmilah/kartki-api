import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User, UserDocument } from './schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { DomainException } from '../domain.exception';
import { PasswordHasherHelper } from './helpers/password-hasher.helper';
import { UrlGeneratorHelper } from './helpers/url-generator.helper';
import { InjectModel } from '@nestjs/mongoose';
import { RevokedToken, RevokedTokenDocument } from './schemas/revoked-token.schema';
import { Model } from 'mongoose';
import { AuthTokenGenerator } from './helpers/auth-token-generator';
import { Tokenizer, Token } from './helpers/tokenizer';
import { SignupRequestInput } from './dto/signup-request.input';
import { SignupConfirmInput } from './dto/signup-confirm.input';
import { STATUS_ACTIVE, STATUS_WAIT } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly mailService: MailService,
        private readonly tokenizer: Tokenizer,
        private readonly passwordHasher: PasswordHasherHelper,
        private readonly urlGenerator: UrlGeneratorHelper,
        private readonly authTokenGenerator: AuthTokenGenerator,
        @InjectModel(RevokedToken.name)
        private readonly revokedTokenModel: Model<RevokedTokenDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) {}

    async getUser(email: string, password: string): Promise<User> {
        const user = await this.findOneByEmail(email);

        if (user) {
            const isPasswordValid = await this.passwordHasher.validate(password, user.passwordHash);
            if (isPasswordValid) {
                return user;
            }
        }

        throw new DomainException('User not found');
    }

    logout(token: string): Promise<RevokedToken> {
        const accessToken = this.authTokenGenerator.getAccessTokenFromString(token);

        return this.revokedTokenModel.create({
            expiredAt: new Date(accessToken.getExpiredAt() * 1000),
            token: accessToken.toString(),
        });
    }

    async isTokenRevoked(token): Promise<boolean> {
        return await this.revokedTokenModel.exists({ token });
    }

    async signupLocalRequest(data: SignupRequestInput, now: Date): Promise<void> {
        if (await this.hasByEmail(data.email)) {
            this.logger.error({ message: `User with email ${data.email} already exists.` });
            throw new DomainException('Invalid data.');
        }

        const token = this.tokenizer.generate(now);
        const passwordHash = await this.passwordHasher.hash(data.password);

        await this.userModel.create({
            email: data.email,
            passwordHash,
            signupConfirmTokenValue: token.getValue(),
            signupConfirmTokenExpires: token.getExpires(),
            name: data.name,
            status: STATUS_WAIT,
        });

        const url = this.urlGenerator.generate('signup/confirm', {
            token: token.getValue(),
        });
        const subject = 'Complete your registration'; // todo translate
        const template = 'signup'; // todo translate

        return this.mailService.send(data.email, subject, template, {
            url,
            name: data.name,
        });
    }

    async signupLocalConfirm(data: SignupConfirmInput, now: Date): Promise<boolean> {
        const user = await this.findOneBySignupRequestToken(data.token);

        if (!user) {
            throw new DomainException(`Token ${data.token} is invalid.`);
        }

        const token = new Token(user.signupConfirmTokenValue, user.signupConfirmTokenExpires);
        if (token.isExpired(now)) {
            throw new DomainException('Token is expired');
        }

        user.signupConfirmTokenValue = null;
        user.signupConfirmTokenExpires = null;
        user.status = STATUS_ACTIVE;

        await this.userModel.findByIdAndUpdate(user._id, user).exec();

        return true;
    }

    async signupSocialNetwork(
        networkName: 'google' | 'facebook',
        networkUserId: string,
        userName: string,
        email: string,
    ): Promise<User> {
        if (!networkUserId || !userName) {
            throw new DomainException('Missing required params');
        }

        const user = await this.findOneByEmail(email);

        if (!user) {
            return await this.userModel.create({
                email: email,
                name: userName,
                [`${networkName}Id`]: networkUserId,
                status: STATUS_ACTIVE,
            });
        }

        if (!user[`${networkName}Id`]) {
            // add network
            user[`${networkName}Id`] = networkUserId;
            user.signupConfirmTokenValue = null;
            user.signupConfirmTokenExpires = null;
            user.status = STATUS_ACTIVE;

            return await this.userModel.findByIdAndUpdate(user._id, user).exec();
        }

        return user;
    }

    public async findOneActiveById(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id, status: STATUS_ACTIVE }).exec();
    }

    private async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    private async hasByEmail(email: string): Promise<boolean> {
        return this.userModel.exists({ email });
    }

    private async findOneBySignupRequestToken(token: string): Promise<User> {
        return this.userModel.findOne({ signupConfirmTokenValue: token }).exec();
    }
}

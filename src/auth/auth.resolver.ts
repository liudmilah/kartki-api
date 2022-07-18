import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupConfirmInput } from './dto/signup-confirm.input';
import { SignupRequestInput } from './dto/signup-request.input';
import { AuthTokens } from './dto/auth-tokens.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginInput } from './dto/login.input';
import { AuthTokenGenerator } from './helpers/auth-token-generator';
import { User } from './schemas/user.schema';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly authTokenGenerator: AuthTokenGenerator,
    ) {}

    @Mutation(returns => AuthTokens)
    async login(@Args('loginData') loginData: LoginInput): Promise<AuthTokens> {
        try {
            const user = await this.authService.getUser(loginData.email, loginData.password);
            return {
                accessToken: this.authTokenGenerator.generateAccessToken(user).toString(),
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Query(returns => String)
    @UseGuards(GqlAuthGuard)
    async logout(@Context() context): Promise<string> {
        const req = context.req;
        const authHeader = req.headers['authorization'];
        const jwt: string = authHeader ? authHeader.split(' ')[1] : '';
        await this.authService.logout(jwt);
        return 'ok';
    }

    @Mutation((returns) => String)
    async signupRequest(@Args('signupRequestData') signupRequestData: SignupRequestInput): Promise<string> {
        await this.authService.signupLocalRequest(signupRequestData, new Date());
        return 'ok';
    }

    @Mutation((returns) => String)
    async signupConfirm(@Args('signupConfirmData') signupConfirmData: SignupConfirmInput): Promise<string> {
        await this.authService.signupLocalConfirm(signupConfirmData, new Date());
        return 'ok';
    }

    @Query((returns) => User)
    @UseGuards(GqlAuthGuard)
    user(@CurrentUser() user?: User): User {
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

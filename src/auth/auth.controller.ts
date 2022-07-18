import { Controller, Get, Req, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Request } from 'express';
import { User } from './schemas/user.schema';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from './guards/fb-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
import { UrlGeneratorHelper } from './helpers/url-generator.helper';
import { AuthTokenGenerator } from './helpers/auth-token-generator';
import { AuthExceptionFilter } from './auth-exceptions.filter';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly urlGenerator: UrlGeneratorHelper,
        private readonly authTokenGenerator: AuthTokenGenerator,
    ) {}

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<string> {
        return 'ok';
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<string> {
        return 'ok';
    }

    @Get('facebook/cb')
    @UseGuards(FacebookAuthGuard)
    async facebookCb(@Req() req: Request, @Res() res: Response): Promise<void> {
        const user = req.user as User;

        const updatedUser = await this.authService.signupSocialNetwork(
            'facebook',
            user.facebookId,
            user.name,
            user.email,
        );

        res.redirect(
            302,
            this.urlGenerator.generate('auth', {
                code: this.authTokenGenerator.generateAccessToken(updatedUser).toString(),
            }),
        );
    }

    @Get('google/cb')
    @UseGuards(GoogleAuthGuard)
    async googleCb(@Req() req: Request, @Res() res: Response): Promise<void> {
        const user = req.user as User;

        const updatedUser = await this.authService.signupSocialNetwork(
            'google',
            user.googleId,
            user.name,
            user.email,
        );

        res.redirect(
            302,
            this.urlGenerator.generate('auth', {
                code: this.authTokenGenerator.generateAccessToken(updatedUser).toString(),
            }),
        );
    }
}
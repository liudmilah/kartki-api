import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UrlGeneratorHelper } from './helpers/url-generator.helper';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly urlGenerator: UrlGeneratorHelper,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error({
            message: exception instanceof Error ? exception.message : 'Unknown exception',
            stack: exception instanceof Error ? exception.stack : '',
        });

        response.redirect(
            302,
            this.urlGenerator.generate(''),
        );
    }
}
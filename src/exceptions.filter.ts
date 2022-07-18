import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from './auth/schemas/user.schema';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();

        const httpStatus =
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            message: exception instanceof HttpException ? exception.message : 'Internal error',
        };

        if (req) {
            // rest error
            const { httpAdapter } = this.httpAdapterHost;

            this.logger.error({
                path: httpAdapter.getRequestUrl(req),
                message: exception instanceof Error ? exception.message : 'Unknown exception',
                user: req.user ? (req.user as User)._id : '',
                stack: exception instanceof Error ? exception.stack : '',
            });
            httpAdapter.reply(res, responseBody, httpStatus);
        } else {
            // gql error
            const gqlHost = GqlArgumentsHost.create(host);
            const info = gqlHost.getInfo<GraphQLResolveInfo>();
            this.logger.error({
                path: `${info.parentType} ${info.fieldName}`,
                message: exception instanceof Error ? exception.message : 'Unknown exception',
                user: '', // todo
                stack: exception instanceof Error ? exception.stack : '',
            });
        }
    }
}

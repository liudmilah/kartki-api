import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req ? req.user : null;
});

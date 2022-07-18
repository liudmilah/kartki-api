import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SetsModule } from './sets/sets.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { AllExceptionsFilter } from './exceptions.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { GqlThrottlerGuard } from './gql-throttler.guard';

const conf = configuration();

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        GraphQLModule.forRoot({
            debug: !conf.isProdEnv,
            playground: !conf.isProdEnv,
            autoSchemaFile: join(process.cwd(), './schema.gql'),
            sortSchema: true,
            context: ({ req, res }) => ({ req, res }),
        }),
        MongooseModule.forRoot(`mongodb://${conf.database.user}:${conf.database.password}@mongodb/kartki`),
        WinstonModule.forRoot({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    dirname: join(process.cwd(), 'log/'),
                    filename: 'kartki.log',
                    level: 'info',
                    maxsize: 1000000,
                    maxFiles: 20,
                }),
            ],
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 20,
        }),
        AuthModule,
        SetsModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: GqlThrottlerGuard
        }
    ],
})
export class AppModule {}

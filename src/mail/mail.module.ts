import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import configuration from '../config/configuration';

const conf = configuration();

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: conf.mailer.host,
                port: +conf.mailer.port,
                secure: false,
                requireTLS: conf.isProdEnv,
                auth: {
                    user: conf.mailer.user,
                    pass: conf.mailer.password,
                },
            },
            defaults: {
                from: `"Kartki" <${conf.mailer.from}>`,
            },
            template: {
                dir: join(process.cwd(), 'dist/templates/pages'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
            options: {
                partials: {
                    dir: join(process.cwd(), 'dist/templates/partials'),
                    options: {
                        strict: true,
                    },
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}

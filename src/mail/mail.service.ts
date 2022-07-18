import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    send(to: string, subject: string, template: string, context?: object): void {
        this.mailerService
            .sendMail({
                to: to,
                subject: subject,
                template: template,
                context: context,
            })
            .then((success) => {
                // todo
                console.log(success);
            })
            .catch((err) => {
                // todo
                console.log(err);
            });
    }
}

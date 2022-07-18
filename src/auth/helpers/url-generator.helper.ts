import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlGeneratorHelper {
    constructor(private configService: ConfigService ) {}

    public generate(uri?: string, params?: Record<string, string>): string {
        const paramsString = params ? new URLSearchParams(params).toString() : '';

        return this.configService.get<string>('frontendUrl') + (uri ? `/${uri}` : '') + (paramsString ? `?${paramsString}` : '');
    }
}

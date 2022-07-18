import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
    constructor(message = 'Domain Exception') {
      super(message, HttpStatus.CONFLICT);
    }
  }
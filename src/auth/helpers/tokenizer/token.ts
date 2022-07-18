import { DomainException } from '../../../domain.exception';

export class Token {
  constructor(private value: string, private expires: Date) {}

  public validate(value: string, expires: Date): void {
    if (!this.isEqualTo(value)) {
      throw new DomainException('Token is invalid');
    }

    if (this.isExpired(expires)) {
      throw new DomainException('Token is expired');
    }
  }

  public isExpired(date: Date): boolean {
    return date >= this.expires;
  }

  public getValue(): string {
    return this.value;
  }

  public getExpires(): Date {
    return this.expires;
  }

  private isEqualTo(value: string): boolean {
    return value === this.value;
  }
}

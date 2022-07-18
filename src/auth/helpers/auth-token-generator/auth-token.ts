import { Jwt } from '../jwt.helper';

export class AuthToken {
    private userName: string;
    private userId: string;
    private email: string;
    private expiredAt: number;

    constructor(private readonly jwt: Jwt) {}

    public setUserName = (userName: string): AuthToken => {
        this.userName = userName;
        return this;
    }

    public setUserId = (userId: string): AuthToken => {
        this.userId = userId;
        return this;
    }

    public setEmail = (email: string): AuthToken => {
        this.email = email;
        return this;
    }

    public setExpiredAt = (expiredAt: number): AuthToken => {
        this.expiredAt = expiredAt;
        return this;
    }

    public expired = (now: Date): boolean => {
        return now.getTime() >= this.expiredAt * 1000;
    }

    public getExpiredAt = (): number => {
        return this.expiredAt;
    }

    public toString = (): string => {
        const payload = {
            email: this.email,
            sub: this.userId,
        };

        return this.jwt.encode(payload);
    }
}
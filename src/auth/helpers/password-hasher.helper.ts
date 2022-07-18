import * as bcrypt from 'bcrypt';

export class PasswordHasherHelper {
    public async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    public validate(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

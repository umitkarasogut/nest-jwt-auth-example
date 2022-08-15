import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
    hash(value) {
        return bcrypt.hash(value, 10);
    }

    compare(value, encrypted) {
        return bcrypt.compare(value, encrypted);
    }
}

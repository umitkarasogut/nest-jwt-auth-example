import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import CreateUserDto from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class UserService {
    constructor(
        private readonly db: DatabaseService,
        private readonly encryptionService: EncryptionService
    ) { }

    find(conditions) {
        return this.db.user.findUnique({ where: conditions });
    }

    async create(dto: CreateUserDto) {
        const emailIsExist = await this.find({ email: dto.email });

        if (emailIsExist) throw Error('Email already taken !');

        dto.password = await this.encryptionService.hash(dto.password)

        return this.db.user.create({ data: dto });
    }
}

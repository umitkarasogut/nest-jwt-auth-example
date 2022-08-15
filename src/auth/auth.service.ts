import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import CreateUserDto from 'src/user/dto/create.user.dto';
import AuthenticatedUser from './types/authenticated.user';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly encryptionService: EncryptionService,
    ) { }

    async login(email: string, password: string) {
        const user = await this.userService.find({ email })

        if (!user || !await this.encryptionService.compare(password, user.password)) return;

        const { id, ...payload } = user;

        return this.jwtService.sign(payload);
    }

    register(dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    async validate(authUser: AuthenticatedUser) {
        const user = await this.userService.find({
            email: authUser.email
        })

        if (user) {
            const { id, password, ...tokenable } = user;
            return tokenable;
        }

        return null;
    }
}

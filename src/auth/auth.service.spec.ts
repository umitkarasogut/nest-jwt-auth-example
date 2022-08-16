import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import CreateUserDto from 'src/user/dto/create.user.dto';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as jwt from 'jsonwebtoken';
import AuthenticatedUser from './types/authenticated.user';

describe('AuthService', () => {
    let service: AuthService;
    const mockUser = {
        email: 'register_test_user@test.com',
        name: 'Register Test User',
        password: '123456789'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UserModule,
                DatabaseModule,
                EncryptionModule,
                PassportModule,
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '60s' },
                })
            ],
            providers: [AuthService, UserService, JwtStrategy, EncryptionService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    test('Register Method Test', async () => {
        const user = new CreateUserDto();

        Object.assign(user, mockUser);

        const createdUser = await service.register(user);

        expect(createdUser.email).toEqual(mockUser.email);
        expect(createdUser.name).toEqual(mockUser.name);
    });

    test('Login and Validate Method Test', async () => {
        const token = await service.login(mockUser.email, mockUser.password);

        const decoded = jwt.decode(token) as AuthenticatedUser;

        expect(decoded.email).toEqual(mockUser.email);
        expect(decoded.name).toEqual(mockUser.name);

        const validated = await service.validate(decoded)

        expect(validated.email).toEqual(mockUser.email);
        expect(validated.name).toEqual(mockUser.name);
    });
});

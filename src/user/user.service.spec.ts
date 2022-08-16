import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { UserService } from './user.service';
import CreateUserDto from './dto/create.user.dto';

describe('UserService', () => {
    let service: UserService;
    const mockUser = {
        email: 'test@testemail.com',
        name: 'Test User',
        password: '123456789'
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, EncryptionModule],
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    test('Create method and email uniqueness', async () => {
        const user = new CreateUserDto();

        Object.assign(user, mockUser);

        const createdUser = await service.create(mockUser);

        expect(createdUser.email).toEqual(mockUser.email);
        expect(createdUser.name).toEqual(mockUser.name);
        expect(createdUser.password).toEqual(mockUser.password);

        expect(async () => await service.create(mockUser)).rejects.toThrow('Email already taken !');
    });

    test('Test find method', async () => {
        const findedUser = await service.find({
            email: mockUser.email
        });

        expect(findedUser.email).toEqual(mockUser.email);
        expect(findedUser.name).toEqual(mockUser.name);
    });
});

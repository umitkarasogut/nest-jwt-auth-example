import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const secret = 'test-string';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('Hash and compare', async () => {
    const hashed = await service.hash(secret);

    const promises = [service.compare('any-string', hashed), service.compare(secret, hashed)];

    const results = await Promise.all(promises);

    const wrongCompare = results[0];
    const correctCompare = results[1];

    expect(wrongCompare).toBe(false);
    expect(correctCompare).toBe(true);
  });
});

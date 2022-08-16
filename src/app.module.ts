import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [AuthModule, DatabaseModule, EncryptionModule],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { TestService } from './test/test.service';

@Module({
  imports: [AuthModule, DatabaseModule, EncryptionModule],
  controllers: [AppController],
  providers: [TestService],
})
export class AppModule { }

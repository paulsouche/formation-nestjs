import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import { PetsController } from './pets.controller';
import { PetsRepository } from './pets.repository';

@Module({
  controllers: [PetsController],
  providers: [PetsRepository],
  imports: [AuthModule],
})
export class PetsModule {}

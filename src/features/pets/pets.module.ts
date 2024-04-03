import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsRepository } from './pets.repository';

@Module({
  controllers: [PetsController],
  providers: [PetsRepository],
})
export class PetsModule {}

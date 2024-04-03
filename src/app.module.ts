import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './features/pets/pets.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PetsModule],
})
export class AppModule {}

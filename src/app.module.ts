import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './features/auth/auth.module';
import { PetsModule } from './features/pets/pets.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PetsModule, AuthModule],
})
export class AppModule {}

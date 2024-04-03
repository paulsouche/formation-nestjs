import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import AuthController from './auth.controller';
import AuthRepository from './auth.repository';
import AuthService from './auth.service';
import JwtStrategy from './jwt-strategy';

@Module({
  controllers: [AuthController],
  exports: [PassportModule],
  // TODO config
  imports: [
    JwtModule.register({
      secretOrPrivateKey: 'mySecretTokenToChangeInProduction',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, AuthRepository, JwtStrategy],
})
export default class AuthModule {}

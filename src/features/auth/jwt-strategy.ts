import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DeserializedJwtDto } from './auth.dto';
import AuthRepository from './auth.repository';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountsRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO configuration
      secretOrKey: 'mySecretTokenToChangeInProduction',
    });
  }

  async validate(payload: DeserializedJwtDto) {
    const account = this.accountsRepository.getAccountById(payload.sub);

    if (!account) {
      throw new UnauthorizedException();
    }

    return account;
  }
}

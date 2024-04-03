import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto, JwtDto } from './auth.dto';
import AuthRepository from './auth.repository';

@Injectable()
export default class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async login({ login, password }: CredentialsDto): Promise<JwtDto> {
    const account = this.authRepository.getAccountByLogin(login);

    if (
      !account ||
      !(await this.authRepository.compareHash(password, account.passwordHash))
    ) {
      throw new UnauthorizedException();
    }

    return {
      jwt: await this.jwtService.signAsync({ sub: account.id }),
    };
  }
}

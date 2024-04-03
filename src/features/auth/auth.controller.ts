import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsDto, JwtDto } from './auth.dto';
import AuthService from './auth.service';

@Controller('login')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() credentials: CredentialsDto): Promise<JwtDto> {
    return this.authService.login(credentials);
  }
}

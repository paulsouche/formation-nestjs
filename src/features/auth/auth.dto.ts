import { IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  @IsString()
  @IsNotEmpty()
  readonly login!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}

export class JwtDto {
  @IsString()
  @IsNotEmpty()
  jwt!: string;
}

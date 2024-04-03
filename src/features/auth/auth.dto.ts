import { IsNotEmpty, IsString } from 'class-validator';
import { accountId } from './auth.repository';

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

export class DeserializedJwtDto {
  sub!: accountId;

  exp!: number;
}

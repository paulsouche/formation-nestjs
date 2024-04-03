import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const accountId = Symbol();

export type accountId = string & typeof accountId;

const passwordHash = Symbol();

type passwordHash = string & typeof passwordHash;

type Account = {
  id: accountId;
  login: string;
  passwordHash: passwordHash;
};

// TODO real postgres connection
const accounts: Account[] = [
  {
    id: randomUUID() as accountId,
    login: 'admin',
    passwordHash: bcrypt.hashSync('admin', 10) as passwordHash,
  },
];

@Injectable()
export default class AuthRepository {
  getAccountById(acntId: accountId) {
    return accounts.find(({ id }) => id === acntId);
  }

  getAccountByLogin(lgn: string): Account | undefined {
    return accounts.find(({ login }) => login === lgn);
  }

  compareHash(password: string, hash: passwordHash): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

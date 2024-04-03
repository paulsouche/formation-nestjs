import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';

describe(`Application`, () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`Should greet`, () => {
    return request(app.getHttpServer())
      .get(`/`)
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual(`Hello World !`);
      });
  });
});

import { ValidationPipe, type INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import type { CreatePetDto, PetDto } from './pets.dto';

describe(`Pets feature`, () => {
  const credentials = {
    login: 'admin',
    password: 'admin',
  };
  let jwt: string;
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe(`When listing all pets`, () => {
    describe(`And not logged in`, () => {
      it(`Should return a 401`, () => {
        return request(app.getHttpServer()).get(`/pets`).expect(401);
      });
    });

    describe(`And logged in`, () => {
      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/login`)
          .send(credentials)
          .expect(201)
          .then(({ body }) => (jwt = body.jwt));
      });

      it(`Should return a list of pets`, () => {
        return request(app.getHttpServer())
          .get(`/pets`)
          .set(`Authorization`, `Bearer ${jwt}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([]);
          });
      });
    });
  });

  describe(`When creating a pet`, () => {
    const createPetDto: CreatePetDto = {
      kind: 'Rabbit',
      name: 'Bugs',
    };

    describe(`And not logged in`, () => {
      it(`Should return a 401`, () => {
        return request(app.getHttpServer())
          .post(`/pets`)
          .send(createPetDto)
          .expect(401);
      });
    });

    describe(`And logged in`, () => {
      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/login`)
          .send(credentials)
          .expect(201)
          .then(({ body }) => (jwt = body.jwt));
      });

      it(`Should store and return the created pet`, () => {
        return request(app.getHttpServer())
          .post(`/pets`)
          .set(`Authorization`, `Bearer ${jwt}`)
          .send(createPetDto)
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({
              id: expect.any(String),
              ...createPetDto,
            });
          });
      });

      describe(`And invalid pet`, () => {
        it(`Should warn user about bad request`, () => {
          return request(app.getHttpServer())
            .post(`/pets`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send({
              kind: 'Mouse',
              name: 'Minnie',
            })
            .expect(400);
        });
      });
    });
  });

  describe(`When getting a pet`, () => {
    describe(`And not logged in`, () => {
      describe('And id does not exist', () => {
        it('Should return a 401', () => {
          return request(app.getHttpServer()).get(`/pets/404`).expect(401);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/login`)
            .send(credentials)
            .expect(201)
            .then(({ body }) => (jwt = body.jwt))
            .then(() =>
              request(app.getHttpServer())
                .post(`/pets`)
                .set(`Authorization`, `Bearer ${jwt}`)
                .send({
                  kind: 'Rabbit',
                  name: 'Bugs',
                }),
            )
            .then(({ body }) => (pet = body));
        });

        it('Should return a 401', () => {
          return request(app.getHttpServer())
            .get(`/pets/${pet.id}`)
            .expect(401);
        });
      });
    });

    describe(`And logged in`, () => {
      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/login`)
          .send(credentials)
          .expect(201)
          .then(({ body }) => (jwt = body.jwt));
      });

      describe('And id does not exist', () => {
        it('Should return a 404', () => {
          return request(app.getHttpServer())
            .get(`/pets/404`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .expect(404);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/pets`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send({
              kind: 'Rabbit',
              name: 'Bugs',
            })
            .then(({ body }) => (pet = body));
        });

        it('Should return the requested pet', () => {
          return request(app.getHttpServer())
            .get(`/pets/${pet.id}`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual(pet);
            });
        });
      });
    });
  });

  describe(`When updating a pet`, () => {
    const updatePetDto: CreatePetDto = {
      kind: 'Hamster',
      name: 'Mickey',
    };

    describe(`And not logged in`, () => {
      describe('And id does not exist', () => {
        it('Should return a 401', () => {
          return request(app.getHttpServer())
            .put(`/pets/404`)
            .send(updatePetDto)
            .expect(401);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/login`)
            .send(credentials)
            .expect(201)
            .then(({ body }) => (jwt = body.jwt))
            .then(() =>
              request(app.getHttpServer())
                .post(`/pets`)
                .set(`Authorization`, `Bearer ${jwt}`)
                .send({
                  kind: 'Rabbit',
                  name: 'Bugs',
                }),
            )
            .then(({ body }) => (pet = body));
        });

        it('Should return a 401', () => {
          return request(app.getHttpServer())
            .put(`/pets/${pet.id}`)
            .send(updatePetDto)
            .expect(401);
        });
      });
    });

    describe(`And logged in`, () => {
      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/login`)
          .send(credentials)
          .expect(201)
          .then(({ body }) => (jwt = body.jwt));
      });

      describe('And id does not exist', () => {
        it('Should return a 404', () => {
          return request(app.getHttpServer())
            .put(`/pets/404`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send(updatePetDto)
            .expect(404);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/pets`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send({
              kind: 'Rabbit',
              name: 'Bugs',
            })
            .then(({ body }) => (pet = body));
        });

        it('Should return the requested pet', () => {
          return request(app.getHttpServer())
            .put(`/pets/${pet.id}`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send(updatePetDto)
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                id: pet.id,
                ...updatePetDto,
              });
            });
        });

        describe(`And invalid pet`, () => {
          it(`Should warn user about bad request`, () => {
            return request(app.getHttpServer())
              .put(`/pets/${pet.id}`)
              .set(`Authorization`, `Bearer ${jwt}`)
              .send({
                kind: 'Mouse',
                name: 'Minnie',
              })
              .expect(400);
          });
        });
      });
    });
  });

  describe(`When deleting a pet`, () => {
    describe(`And not logged in`, () => {
      describe('And id does not exist', () => {
        it('Should return a 401', () => {
          return request(app.getHttpServer()).delete(`/pets/404`).expect(401);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/login`)
            .send(credentials)
            .expect(201)
            .then(({ body }) => (jwt = body.jwt))
            .then(() =>
              request(app.getHttpServer())
                .post(`/pets`)
                .set(`Authorization`, `Bearer ${jwt}`)
                .send({
                  kind: 'Rabbit',
                  name: 'Bugs',
                }),
            )
            .then(({ body }) => (pet = body));
        });

        it('Should return a 401', () => {
          return request(app.getHttpServer())
            .delete(`/pets/${pet.id}`)
            .expect(401);
        });
      });
    });

    describe(`And logged in`, () => {
      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/login`)
          .send(credentials)
          .expect(201)
          .then(({ body }) => (jwt = body.jwt));
      });

      describe('And id does not exist', () => {
        it('Should return a 404', () => {
          return request(app.getHttpServer())
            .delete(`/pets/404`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .expect(404);
        });
      });

      describe('And id exists', () => {
        let pet: PetDto;

        beforeEach(() => {
          return request(app.getHttpServer())
            .post(`/pets`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .send({
              kind: 'Rabbit',
              name: 'Bugs',
            })
            .then(({ body }) => (pet = body));
        });

        it('Should delete the pet', () => {
          return request(app.getHttpServer())
            .delete(`/pets/${pet.id}`)
            .set(`Authorization`, `Bearer ${jwt}`)
            .expect(200);
        });
      });
    });
  });
});

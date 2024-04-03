import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import type { CreatePetDto, PetDto } from './pets.dto';

describe(`Pets feature`, () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`Should return a list of pets`, () => {
    return request(app.getHttpServer())
      .get(`/pets`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });

  describe(`When creating a pet`, () => {
    const createPetDto: CreatePetDto = {
      kind: 'Rabbit',
      name: 'Bugs',
    };

    it(`Should store and return the created pet`, () => {
      return request(app.getHttpServer())
        .post(`/pets`)
        .send(createPetDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            ...createPetDto,
          });
        });
    });
  });

  describe(`When getting a pet`, () => {
    describe('And id does not exist', () => {
      it('Should return a 404', () => {
        return request(app.getHttpServer()).get(`/pets/404`).expect(404);
      });
    });

    describe('And id exists', () => {
      let pet: PetDto;

      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/pets`)
          .send({
            kind: 'Rabbit',
            name: 'Bugs',
          })
          .then(({ body }) => (pet = body));
      });

      it('Should return the requested pet', () => {
        return request(app.getHttpServer())
          .get(`/pets/${pet.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual(pet);
          });
      });
    });
  });

  describe(`When updating a pet`, () => {
    const updatePetDto: CreatePetDto = {
      kind: 'Hamster',
      name: 'Mickey',
    };

    describe('And id does not exist', () => {
      it('Should return a 404', () => {
        return request(app.getHttpServer())
          .put(`/pets/404`)
          .send(updatePetDto)
          .expect(404);
      });
    });

    describe('And id exists', () => {
      let pet: PetDto;

      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/pets`)
          .send({
            kind: 'Rabbit',
            name: 'Bugs',
          })
          .then(({ body }) => (pet = body));
      });

      it('Should return the requested pet', () => {
        return request(app.getHttpServer())
          .put(`/pets/${pet.id}`)
          .send(updatePetDto)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              id: pet.id,
              ...updatePetDto,
            });
          });
      });
    });
  });

  describe(`When deleting a pet`, () => {
    describe('And id does not exist', () => {
      it('Should return a 404', () => {
        return request(app.getHttpServer()).delete(`/pets/404`).expect(404);
      });
    });

    describe('And id exists', () => {
      let pet: PetDto;

      beforeEach(() => {
        return request(app.getHttpServer())
          .post(`/pets`)
          .send({
            kind: 'Rabbit',
            name: 'Bugs',
          })
          .then(({ body }) => (pet = body));
      });

      it('Should delete the pet', () => {
        return request(app.getHttpServer())
          .delete(`/pets/${pet.id}`)
          .expect(200);
      });
    });
  });
});

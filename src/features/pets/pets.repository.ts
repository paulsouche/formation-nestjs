import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreatePetDto, PetDto, UpdatePetDto, petId } from './pets.dto';

// TODO real DB
const pets: PetDto[] = [];

export class PetsRepository {
  listPets() {
    return pets;
  }

  createPet(pet: CreatePetDto) {
    const createdPet: PetDto = {
      id: randomUUID() as petId,
      ...pet,
    };

    pets.push(createdPet);

    return createdPet;
  }

  getPet(id: petId) {
    const pet = pets.find((p) => p.id === id);

    if (!pet) {
      throw new NotFoundException(`Cannot find pet with id ${id}`);
    }

    return pet;
  }

  updatePet(pet: UpdatePetDto) {
    const petToUpdate = pets.find((p) => p.id === pet.id);

    if (!petToUpdate) {
      throw new NotFoundException(`Cannot find pet with id ${pet.id}`);
    }

    return Object.assign(petToUpdate, pet);
  }

  deletePet(id: petId) {
    const petToDeleteIndex = pets.findIndex((p) => p.id === id);

    if (petToDeleteIndex < 0) {
      throw new NotFoundException(`Cannot find pet with id ${id}`);
    }

    pets.splice(petToDeleteIndex, 1);
  }
}

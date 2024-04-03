const petId = Symbol();

export type petId = string & typeof petId;

const PetKind = {
  Cat: 'Cat',
  Dog: 'Dog',
  Hamster: 'Hamster',
  Rabbit: 'Rabbit',
} as const;

type PetKind = keyof typeof PetKind;

export class CreatePetDto {
  kind!: PetKind;
  name!: string;
}

export class UpdatePetDto {
  id!: petId;
  kind?: PetKind;
  name?: string;
}

export class PetDto {
  id!: petId;
  kind!: PetKind;
  name!: string;
}

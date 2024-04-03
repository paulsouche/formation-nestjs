import { Optional } from '@nestjs/common';
import { IsDefined, IsIn, IsString } from 'class-validator';

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
  @IsIn(Object.values(PetKind))
  @IsDefined()
  kind!: PetKind;

  @IsString()
  name!: string;
}

export class UpdatePetDto {
  @Optional()
  id!: petId;

  @IsIn(Object.values(PetKind))
  @Optional()
  kind?: PetKind;

  @IsString()
  @Optional()
  name?: string;
}

export class PetDto {
  id!: petId;
  kind!: PetKind;
  name!: string;
}

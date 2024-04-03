import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePetDto, UpdatePetDto, petId } from './pets.dto';
import { PetsRepository } from './pets.repository';

@Controller('pets')
@UseGuards(AuthGuard())
export class PetsController {
  constructor(private readonly petsRepository: PetsRepository) {}

  @Get()
  listPets() {
    return this.petsRepository.listPets();
  }

  @Post()
  createPet(@Body() createPetDto: CreatePetDto) {
    return this.petsRepository.createPet(createPetDto);
  }

  @Get(':id')
  getPet(@Param('id') id: petId) {
    return this.petsRepository.getPet(id);
  }

  @Put(':id')
  update(@Param('id') id: petId, @Body() updatePetDto: UpdatePetDto) {
    return this.petsRepository.updatePet({
      ...updatePetDto,
      id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: petId) {
    return this.petsRepository.deletePet(id);
  }
}

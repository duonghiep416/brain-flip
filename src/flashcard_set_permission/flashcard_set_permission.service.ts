import { Injectable } from '@nestjs/common';
import { CreateFlashcardSetPermissionDto } from './dto/create-flashcard_set_permission.dto';
import { UpdateFlashcardSetPermissionDto } from './dto/update-flashcard_set_permission.dto';

@Injectable()
export class FlashcardSetPermissionService {
  create(createFlashcardSetPermissionDto: CreateFlashcardSetPermissionDto) {
    return 'This action adds a new flashcardSetPermission';
  }

  findAll() {
    return `This action returns all flashcardSetPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashcardSetPermission`;
  }

  update(id: number, updateFlashcardSetPermissionDto: UpdateFlashcardSetPermissionDto) {
    return `This action updates a #${id} flashcardSetPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashcardSetPermission`;
  }
}

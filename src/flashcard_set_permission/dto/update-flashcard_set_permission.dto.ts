import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardSetPermissionDto } from './create-flashcard_set_permission.dto';

export class UpdateFlashcardSetPermissionDto extends PartialType(
  CreateFlashcardSetPermissionDto,
) {}

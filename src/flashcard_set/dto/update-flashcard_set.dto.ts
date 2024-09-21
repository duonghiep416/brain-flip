import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardSetDto } from './create-flashcard_set.dto';

export class UpdateFlashcardSetDto extends PartialType(CreateFlashcardSetDto) {}

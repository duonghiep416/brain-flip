import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardBookmarkDto } from './create-flashcard_bookmark.dto';

export class UpdateFlashcardBookmarkDto extends PartialType(
  CreateFlashcardBookmarkDto,
) {}

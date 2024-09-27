import { PartialType } from '@nestjs/mapped-types';
import { ToggleFlashcardBookmarkDto } from 'src/flashcard_bookmark/dto/toggle-flashcard_bookmark.dto';

export class UpdateFlashcardBookmarkDto extends PartialType(
  ToggleFlashcardBookmarkDto,
) {}

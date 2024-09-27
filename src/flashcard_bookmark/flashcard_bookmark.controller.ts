import { Controller, Post, Param, Req } from '@nestjs/common';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';
import { Request } from 'express';

@Controller('flashcard-bookmark')
export class FlashcardBookmarkController {
  constructor(
    private readonly flashcardBookmarkService: FlashcardBookmarkService,
  ) {}

  @Post(':id')
  toggle(@Param('id') id: string, @Req() req: Request) {
    return this.flashcardBookmarkService.toggle(id, req);
  }
}

import { Module } from '@nestjs/common';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';
import { FlashcardBookmarkController } from './flashcard_bookmark.controller';

@Module({
  controllers: [FlashcardBookmarkController],
  providers: [FlashcardBookmarkService],
})
export class FlashcardBookmarkModule {}

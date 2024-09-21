import { Module } from '@nestjs/common';
import { FlashcardSetService } from './flashcard_set.service';
import { FlashcardSetController } from './flashcard_set.controller';

@Module({
  controllers: [FlashcardSetController],
  providers: [FlashcardSetService],
})
export class FlashcardSetModule {}

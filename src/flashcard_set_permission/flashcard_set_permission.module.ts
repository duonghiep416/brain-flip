import { Module } from '@nestjs/common';
import { FlashcardSetPermissionService } from './flashcard_set_permission.service';
import { FlashcardSetPermissionController } from './flashcard_set_permission.controller';

@Module({
  controllers: [FlashcardSetPermissionController],
  providers: [FlashcardSetPermissionService],
})
export class FlashcardSetPermissionModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardBookmarkController } from './flashcard_bookmark.controller';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';

describe('FlashcardBookmarkController', () => {
  let controller: FlashcardBookmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardBookmarkController],
      providers: [FlashcardBookmarkService],
    }).compile();

    controller = module.get<FlashcardBookmarkController>(
      FlashcardBookmarkController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

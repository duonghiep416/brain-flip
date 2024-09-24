import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';

describe('FlashcardBookmarkService', () => {
  let service: FlashcardBookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardBookmarkService],
    }).compile();

    service = module.get<FlashcardBookmarkService>(FlashcardBookmarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

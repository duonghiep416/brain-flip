import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetService } from './flashcard_set.service';

describe('FlashcardSetService', () => {
  let service: FlashcardSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardSetService],
    }).compile();

    service = module.get<FlashcardSetService>(FlashcardSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

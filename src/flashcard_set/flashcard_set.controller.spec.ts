import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetController } from './flashcard_set.controller';
import { FlashcardSetService } from './flashcard_set.service';

describe('FlashcardSetController', () => {
  let controller: FlashcardSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardSetController],
      providers: [FlashcardSetService],
    }).compile();

    controller = module.get<FlashcardSetController>(FlashcardSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

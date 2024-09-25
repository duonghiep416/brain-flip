import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetPermissionController } from './flashcard_set_permission.controller';
import { FlashcardSetPermissionService } from './flashcard_set_permission.service';

describe('FlashcardSetPermissionController', () => {
  let controller: FlashcardSetPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardSetPermissionController],
      providers: [FlashcardSetPermissionService],
    }).compile();

    controller = module.get<FlashcardSetPermissionController>(
      FlashcardSetPermissionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

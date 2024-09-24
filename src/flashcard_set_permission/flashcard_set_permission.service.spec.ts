import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetPermissionService } from './flashcard_set_permission.service';

describe('FlashcardSetPermissionService', () => {
  let service: FlashcardSetPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardSetPermissionService],
    }).compile();

    service = module.get<FlashcardSetPermissionService>(FlashcardSetPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

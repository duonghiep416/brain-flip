import { Injectable } from '@nestjs/common';
import { CreateFlashcardBookmarkDto } from './dto/create-flashcard_bookmark.dto';
import { UpdateFlashcardBookmarkDto } from './dto/update-flashcard_bookmark.dto';

@Injectable()
export class FlashcardBookmarkService {
  create(createFlashcardBookmarkDto: CreateFlashcardBookmarkDto) {
    return 'This action adds a new flashcardBookmark';
  }

  findAll() {
    return `This action returns all flashcardBookmark`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashcardBookmark`;
  }

  update(id: number, updateFlashcardBookmarkDto: UpdateFlashcardBookmarkDto) {
    return `This action updates a #${id} flashcardBookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashcardBookmark`;
  }
}

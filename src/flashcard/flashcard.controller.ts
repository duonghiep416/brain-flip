import { Controller, Post, Body } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Post()
  create(@Body() createFlashcardDto: CreateFlashcardDto) {
    return this.flashcardService.create(createFlashcardDto);
  }
}

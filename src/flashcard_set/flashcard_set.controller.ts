import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlashcardSetService } from './flashcard_set.service';
import { CreateFlashcardSetDto } from './dto/create-flashcard_set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard_set.dto';

@Controller('flashcard-set')
export class FlashcardSetController {
  constructor(private readonly flashcardSetService: FlashcardSetService) {}

  @Post()
  create(@Body() createFlashcardSetDto: CreateFlashcardSetDto) {
    return this.flashcardSetService.create(createFlashcardSetDto);
  }

  @Get()
  findAll() {
    return this.flashcardSetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardSetService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashcardSetDto: UpdateFlashcardSetDto,
  ) {
    return this.flashcardSetService.update(+id, updateFlashcardSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardSetService.remove(+id);
  }
}

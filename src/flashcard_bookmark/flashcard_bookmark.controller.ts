import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';
import { CreateFlashcardBookmarkDto } from './dto/create-flashcard_bookmark.dto';
import { UpdateFlashcardBookmarkDto } from './dto/update-flashcard_bookmark.dto';

@Controller('flashcard-bookmark')
export class FlashcardBookmarkController {
  constructor(
    private readonly flashcardBookmarkService: FlashcardBookmarkService,
  ) {}

  @Post()
  create(@Body() createFlashcardBookmarkDto: CreateFlashcardBookmarkDto) {
    return this.flashcardBookmarkService.create(createFlashcardBookmarkDto);
  }

  @Get()
  findAll() {
    return this.flashcardBookmarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardBookmarkService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashcardBookmarkDto: UpdateFlashcardBookmarkDto,
  ) {
    return this.flashcardBookmarkService.update(
      +id,
      updateFlashcardBookmarkDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardBookmarkService.remove(+id);
  }
}

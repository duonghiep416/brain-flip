import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { FlashcardSetService } from './flashcard_set.service';
import { CreateFlashcardSetDto } from './dto/create-flashcard_set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard_set.dto';
import { Request } from 'express';

@Controller('flashcard-sets')
export class FlashcardSetController {
  constructor(private readonly flashcardSetService: FlashcardSetService) {}

  @Post()
  create(
    @Body() createFlashcardSetDto: CreateFlashcardSetDto,
    @Req() req: Request,
  ) {
    return this.flashcardSetService.create(createFlashcardSetDto, req);
  }

  @Get()
  findAll(@Query() query, @Req() req: Request) {
    return this.flashcardSetService.findAll(query, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardSetService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashcardSetDto: UpdateFlashcardSetDto,
    @Req() req: Request,
  ) {
    return this.flashcardSetService.update(id, updateFlashcardSetDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.flashcardSetService.remove(id, req);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlashcardSetPermissionService } from './flashcard_set_permission.service';
import { CreateFlashcardSetPermissionDto } from './dto/create-flashcard_set_permission.dto';
import { UpdateFlashcardSetPermissionDto } from './dto/update-flashcard_set_permission.dto';

@Controller('flashcard-set-permission')
export class FlashcardSetPermissionController {
  constructor(
    private readonly flashcardSetPermissionService: FlashcardSetPermissionService,
  ) {}

  @Post()
  create(
    @Body() createFlashcardSetPermissionDto: CreateFlashcardSetPermissionDto,
  ) {
    return this.flashcardSetPermissionService.create(
      createFlashcardSetPermissionDto,
    );
  }

  @Get()
  findAll() {
    return this.flashcardSetPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardSetPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashcardSetPermissionDto: UpdateFlashcardSetPermissionDto,
  ) {
    return this.flashcardSetPermissionService.update(
      +id,
      updateFlashcardSetPermissionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardSetPermissionService.remove(+id);
  }
}

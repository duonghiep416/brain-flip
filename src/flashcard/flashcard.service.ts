import { Injectable } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlashcardService {
  constructor(
    @InjectRepository(Flashcard)
    private readonly flashcardRepository: Repository<Flashcard>,
  ) {}
  async create(createFlashcardDto: CreateFlashcardDto) {
    try {
      const flashcard = this.flashcardRepository.create(createFlashcardDto);
      const savedFlashcard = await this.flashcardRepository.save(flashcard);
      return savedFlashcard;
    } catch (error) {
      console.error('error', error);
    }
  }

  async createMany(createFlashcardDtos: CreateFlashcardDto[]) {
    try {
      const flashcards = this.flashcardRepository.create(createFlashcardDtos);
      const savedFlashcards = await this.flashcardRepository.save(flashcards);
      return savedFlashcards;
    } catch (error) {
      console.error('error', error);
    }
  }
}

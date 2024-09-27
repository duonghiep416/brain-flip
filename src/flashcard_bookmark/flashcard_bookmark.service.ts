import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FlashcardBookmark } from 'src/flashcard_bookmark/entities/flashcard_bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { Request } from 'express';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class FlashcardBookmarkService {
  constructor(
    @InjectRepository(FlashcardBookmark)
    private readonly flashcardBookmarkRepository: Repository<FlashcardBookmark>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Flashcard)
    private readonly flashcardRepository: Repository<Flashcard>,

    private readonly tokenService: TokenService,
  ) {}

  async toggle(id: string, req: Request) {
    const { sub: user_id } = this.tokenService.getDataFromToken(req);

    // Build the query to check if the bookmark already exists
    const queryBuilder = this.flashcardBookmarkRepository
      .createQueryBuilder('flashcard_bookmark')
      .leftJoinAndSelect('flashcard_bookmark.user', 'user')
      .leftJoinAndSelect('flashcard_bookmark.flashcard', 'flashcard')
      .andWhere('user.id = :user_id', { user_id })
      .andWhere('flashcard.id = :flashcard_id', { flashcard_id: id });

    const flashcardBookmark = await queryBuilder.getOne();

    if (flashcardBookmark) {
      // If bookmark exists, remove it and return appropriate message
      await this.flashcardBookmarkRepository.remove(flashcardBookmark);
      return {
        status: 'removed',
        message: 'Flashcard bookmark removed successfully',
      };
    } else {
      // Fetch User and Flashcard entities
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      const flashcard = await this.flashcardRepository.findOne({
        where: { id: id },
      });
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${id} not found`);
      }

      // Create a new FlashcardBookmark entity
      const newFlashcardBookmark = this.flashcardBookmarkRepository.create({
        user: user,
        flashcard: flashcard,
      });

      // Save the new entity and return appropriate message
      await this.flashcardBookmarkRepository.save(newFlashcardBookmark);
      return {
        status: 'added',
        message: 'Flashcard bookmark added successfully',
      };
    }
  }
}

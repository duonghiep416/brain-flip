import { Module } from '@nestjs/common';
import { FlashcardBookmarkService } from './flashcard_bookmark.service';
import { FlashcardBookmarkController } from './flashcard_bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardBookmark } from 'src/flashcard_bookmark/entities/flashcard_bookmark.entity';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/shared/services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardBookmark, User, Flashcard])],
  controllers: [FlashcardBookmarkController],
  providers: [FlashcardBookmarkService, TokenService, JwtService],
})
export class FlashcardBookmarkModule {}

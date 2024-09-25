import { Module } from '@nestjs/common';
import { FlashcardSetService } from './flashcard_set.service';
import { FlashcardSetController } from './flashcard_set.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardSet } from 'src/flashcard_set/entities/flashcard_set.entity';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { TokenService } from 'src/shared/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { FlashcardSetPermission } from 'src/flashcard_set_permission/entities/flashcard_set_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FlashcardSet,
      Flashcard,
      User,
      FlashcardSetPermission,
    ]),
    ConfigModule,
  ],
  controllers: [FlashcardSetController],
  providers: [FlashcardSetService, TokenService, JwtService],
})
export class FlashcardSetModule {}

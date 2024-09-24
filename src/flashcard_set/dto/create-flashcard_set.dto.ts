import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFlashcardDto } from 'src/flashcard/dto/create-flashcard.dto';

export class CreateFlashcardSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  is_private: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashcardDto) // Sử dụng class-transformer để chuyển đổi dữ liệu flashcards
  flashcards: CreateFlashcardDto[];
}

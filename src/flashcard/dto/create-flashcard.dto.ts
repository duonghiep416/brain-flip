import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  @IsNotEmpty()
  term: string;

  @IsString()
  @IsNotEmpty()
  definition: string;
}

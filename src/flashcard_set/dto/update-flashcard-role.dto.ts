import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFlashcardSetRoleDto {
  @IsNumber()
  @IsNotEmpty()
  role: number;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}

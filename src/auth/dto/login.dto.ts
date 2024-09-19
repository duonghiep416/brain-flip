import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsPassword } from 'src/common/validators/password.validators';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPassword()
  password: string;
}

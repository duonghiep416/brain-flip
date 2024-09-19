import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { IsPassword } from 'src/common/validators/password.validators';

export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(Object.keys(UserRole).map((key) => UserRole[key]), {
    message: 'role must be an enum value',
  })
  @IsNumber()
  role: UserRole.ADMIN | UserRole.USER | UserRole.GUEST;

  @IsPassword()
  password: string;
}

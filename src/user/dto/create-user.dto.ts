import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(Object.keys(UserRole).map((key) => UserRole[key]), {
    message: 'role must be an enum value',
  })
  @IsNumber()
  role: UserRole.ADMIN | UserRole.USER | UserRole.GUEST;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  password: string;
}

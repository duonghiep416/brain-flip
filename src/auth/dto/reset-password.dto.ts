import { IsPassword } from 'src/common/validators/password.validators';

export class ResetPasswordDto {
  @IsPassword()
  newPassword: string;
}

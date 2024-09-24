import { IsEnum, IsNotEmpty } from 'class-validator';
import { TokenType } from 'src/common/enums/token-type.enum';

export class CreateBlacklistTokenDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsEnum(Object.keys(TokenType).map((key) => TokenType[key]), {
    message: 'type must be an enum value',
  })
  type: TokenType.ACCESS | TokenType.REFRESH;
}

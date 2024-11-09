import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { BlacklistTokenService } from 'src/blacklist_token/blacklist_token.service';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import { PasswordService } from 'src/shared/services/password.service';
import { TokenService } from 'src/shared/services/token.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenService: BlacklistTokenService,

    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email }, // Tìm user theo email
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.last_login = new Date();
    await this.usersRepository.save(user);

    const isPasswordValid = await PasswordService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = refreshTokenDto.refreshToken;
    const isTokenValid = this.tokenService.verifyRefreshToken(refreshToken);
    const decodedRefreshToken = this.tokenService.decodeRefreshToken(
      this.tokenService.getRefreshToken(refreshToken),
    );
    console.log('isTokenValid', isTokenValid);
    // if (!isTokenValid) {
    //   throw new UnauthorizedException('Invalid token');
    // }
    await this.blacklistTokenService.create({
      token: refreshToken,
      type: TokenType.REFRESH,
    });
    return {
      accessToken: this.tokenService.generateAccessToken(decodedRefreshToken),
      refreshToken: this.tokenService.generateRefreshToken(decodedRefreshToken),
    };
  }
}

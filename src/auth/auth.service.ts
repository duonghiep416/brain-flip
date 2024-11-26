import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { PasswordResetToken } from 'src/auth/entities/password_reset_tokens.entity';
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

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenService: BlacklistTokenService,

    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const userEntity = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (userEntity) {
      const resetPasswordToken =
        this.tokenService.generateResetPasswordToken(userEntity);
      const expiresIn = this.configService.get<string>(
        'JWT_RESET_PASSWORD_SECRET_EXPIRES_IN',
      );
      const expires_at = new Date(Date.now() + parseInt(expiresIn) * 1000);
      await this.passwordResetTokenRepository.save({
        user: userEntity,
        token: resetPasswordToken.value,
        expires_at: expires_at,
      });
      return {
        message: 'Check your email to reset password',
      };
    } else {
      throw new NotFoundException('User not found');
    }
  }
}

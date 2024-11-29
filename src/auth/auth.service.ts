import {
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { PasswordResetToken } from 'src/auth/entities/password_reset_tokens.entity';
import { BlacklistTokenService } from 'src/blacklist_token/blacklist_token.service';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import { EmailService } from 'src/email/email.service';
import { PasswordService } from 'src/shared/services/password.service';
import { TokenService } from 'src/shared/services/token.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenRepository: Repository<BlacklistToken>,

    private readonly blacklistTokenService: BlacklistTokenService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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

  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
    @Req() req: Request,
  ) {
    const { email } = requestResetPasswordDto;
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
        expires_at,
      });
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const resetPasswordUrl = `${baseUrl}/auth/forgot-password/reset?reset_token=${resetPasswordToken.value}`;
      await this.emailService.sendEmail(
        email,
        'Reset Password',
        'reset_password',
        {
          name: userEntity.name,
          url: resetPasswordUrl,
          expires_at: this.tokenService.convertExpireToken(expiresIn),
        },
      );
      return {
        message: 'Check your email to reset password',
      };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async resetPassword(
    resetToken: string,
    resetPasswordDto: ResetPasswordDto,
    req: Request,
  ) {
    const blacklistToken = await this.blacklistTokenRepository.findOne({
      where: { token: resetToken, type: TokenType.RESET },
    });
    if (
      blacklistToken ||
      !this.tokenService.verifyResetPasswordToken(resetToken)
    )
      throw new UnauthorizedException();

    const { sub: currentUserId } = this.tokenService.getDataFromToken(
      req,
      true,
      resetToken,
    );
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: currentUserId,
        },
      });
      user.password = await PasswordService.hashPassword(
        resetPasswordDto.newPassword,
      );
      const savedUser = await this.usersRepository.save(user);
      await this.blacklistTokenRepository.save({
        token: resetToken,
        type: TokenType.RESET,
      });
      return omit(savedUser, 'password');
    } catch (error) {
      console.error('error', error);
    }
  }
}

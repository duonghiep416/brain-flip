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
    // Injecting User repository for database interactions related to User entity
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // Injecting PasswordResetToken repository for reset token management
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

    // Injecting BlacklistToken repository for blacklisted token management
    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenRepository: Repository<BlacklistToken>,

    // Other services required by AuthService
    private readonly blacklistTokenService: BlacklistTokenService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // Handles user login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the last login time
    user.last_login = new Date();
    await this.usersRepository.save(user);

    // Verify user's password
    const isPasswordValid = await PasswordService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate access and refresh tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Refreshes access and refresh tokens using a valid refresh token
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = refreshTokenDto.refreshToken;

    // Verify the refresh token's validity
    const isTokenValid = this.tokenService.verifyRefreshToken(refreshToken);

    // Decode the refresh token
    const decodedRefreshToken = this.tokenService.decodeRefreshToken(
      this.tokenService.getRefreshToken(refreshToken),
    );

    console.log('isTokenValid', isTokenValid);

    // Add the old refresh token to the blacklist
    await this.blacklistTokenService.create({
      token: refreshToken,
      type: TokenType.REFRESH,
    });

    // Generate new access and refresh tokens
    return {
      accessToken: this.tokenService.generateAccessToken(decodedRefreshToken),
      refreshToken: this.tokenService.generateRefreshToken(decodedRefreshToken),
    };
  }

  // Sends a reset password email with a reset token
  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
    @Req() req: Request,
  ) {
    const { email } = requestResetPasswordDto;

    // Find user by email
    const userEntity = await this.usersRepository.findOne({
      where: { email },
    });

    if (userEntity) {
      // Generate a reset password token
      const resetPasswordToken =
        this.tokenService.generateResetPasswordToken(userEntity);

      // Calculate the token's expiry time
      const expiresIn = this.configService.get<string>(
        'JWT_RESET_PASSWORD_SECRET_EXPIRES_IN',
      );
      const expires_at = new Date(Date.now() + parseInt(expiresIn) * 1000);

      // Save the token in the database
      await this.passwordResetTokenRepository.save({
        user: userEntity,
        token: resetPasswordToken.value,
        expires_at,
      });

      // Construct the reset password URL

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      console.log('baseUrl', baseUrl);
      // const resetPasswordUrl = `${baseUrl}/auth/forgot-password/reset?reset_token=${resetPasswordToken.value}`;
      const clientURL = this.configService.get('CLIENT_URL');
      const resetPasswordUrl = `${clientURL}/forgot-password/reset?reset_token=${resetPasswordToken.value}`;
      console.log('resetPasswordUrl', resetPasswordUrl);
      // Send reset password email
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

      return { message: 'Check your email to reset password' };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  // Resets the user's password
  async resetPassword(
    resetToken: string,
    resetPasswordDto: ResetPasswordDto,
    req: Request,
  ) {
    // Check if the reset token is blacklisted or invalid
    const blacklistToken = await this.blacklistTokenRepository.findOne({
      where: { token: resetToken, type: TokenType.RESET },
    });

    if (
      blacklistToken ||
      !this.tokenService.verifyResetPasswordToken(resetToken)
    ) {
      throw new UnauthorizedException();
    }

    // Decode the token to get the user's ID
    const { sub: currentUserId } = this.tokenService.getDataFromToken(
      req,
      true,
      resetToken,
    );

    try {
      // Find user by ID and update the password
      const user = await this.usersRepository.findOne({
        where: { id: currentUserId },
      });
      user.password = await PasswordService.hashPassword(
        resetPasswordDto.newPassword,
      );

      // Save updated user and blacklist the reset token
      const savedUser = await this.usersRepository.save(user);
      await this.blacklistTokenRepository.save({
        token: resetToken,
        type: TokenType.RESET,
      });

      // Return user data excluding password
      return omit(savedUser, 'password');
    } catch (error) {
      console.error('error', error);
    }
  }

  async validateToken(req: Request) {
    const token = this.tokenService.getAccessToken(req);
    // Check if the reset token is blacklisted or invalid
    const blacklistToken = await this.blacklistTokenRepository.findOne({
      where: { token: token, type: TokenType.ACCESS },
    });

    if (blacklistToken || !this.tokenService.verifyAccessToken(token)) {
      throw new UnauthorizedException();
    }
  }
}

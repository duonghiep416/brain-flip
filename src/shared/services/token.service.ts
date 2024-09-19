// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Tạo Access Token
  generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'), // Sử dụng secret cho access token
      expiresIn: this.configService.get('JWT_SECRET_EXPIRES_IN'), // Thời gian hết hạn của access token
    });
  }

  // Tạo Refresh Token
  generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'), // Sử dụng secret khác cho refresh token
      expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRES_IN'), // Thời gian hết hạn của refresh token
    });
  }
}

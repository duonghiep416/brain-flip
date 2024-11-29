// src/auth/token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'; // Import TokenExpiredError để kiểm tra lỗi hết hạn
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Tạo Access Token
  generateAccessToken(user: User): { value: string; expiresIn: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      value: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_SECRET_EXPIRES_IN'),
      }),
      expiresIn: this.configService.get('JWT_SECRET_EXPIRES_IN'),
    };
  }

  // Tạo Refresh Token
  generateRefreshToken(user: User): { value: string; expiresIn: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      value: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'), // Sử dụng secret khác cho refresh token
        expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRES_IN'), // Thời gian hết hạn của refresh token
      }),
      expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRES_IN'),
    };
  }

  generateResetPasswordToken(user: User): { value: string; expiresIn: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      value: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
        expiresIn: this.configService.get(
          'JWT_RESET_PASSWORD_SECRET_EXPIRES_IN',
        ),
      }),
      expiresIn: this.configService.get('JWT_RESET_PASSWORD_SECRET_EXPIRES_IN'),
    };
  }
  // Verify Access Token với xử lý trả về false nếu hết hạn hoặc không hợp lệ
  verifyAccessToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return true; // Token hợp lệ
    } catch (error) {
      console.error('error', error);
      // Token không hợp lệ hoặc hết hạn
      return false;
    }
  }

  // Verify Refresh Token với xử lý trả về false nếu hết hạn hoặc không hợp lệ
  verifyRefreshToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return true; // Token hợp lệ
    } catch (error) {
      console.error('error', error);
      // Token không hợp lệ hoặc hết hạn
      return false;
    }
  }

  verifyResetPasswordToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      });
      return true; // Token hợp lệ
    } catch (error) {
      console.error('error', error);
      // Token không hợp lệ hoặc hết hạn
      return false;
    }
  }

  // Decode Access Token
  decodeAccessToken(token: string) {
    return this.jwtService.decode(token);
  }

  // Decode Refresh Token
  decodeRefreshToken(token: string) {
    return this.jwtService.decode(token);
  }

  decodeResetPasswordToken(token: string) {
    return this.jwtService.decode(token);
  }

  getDataFromToken(req: Request, withoutAuthorized?: boolean, token?: string) {
    let data;
    if (!withoutAuthorized) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new UnauthorizedException();
      const token = authHeader.split(' ')[1];
      data = this.decodeAccessToken(token);
    }

    if (token && withoutAuthorized) {
      data = this.decodeResetPasswordToken(token);
    }

    return data;
  }

  getAccessToken(req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException();
    const token = authHeader.split(' ')[1];
    return token;
  }

  getRefreshToken(token: string) {
    return token.split(' ')[1];
  }

  convertExpireToken(expireStr: string): string {
    // Bảng ánh xạ từ ký tự sang chuỗi đầy đủ
    const timeUnits: { [key: string]: string } = {
      m: 'minute',
      h: 'hour',
      d: 'day',
      s: 'second',
      w: 'week',
      y: 'year',
    };

    // Tách số và ký tự
    const number = parseInt(expireStr.slice(0, -1)); // Lấy phần số
    const unit = expireStr.slice(-1); // Lấy ký tự cuối (đơn vị)

    // Kiểm tra nếu đơn vị hợp lệ
    const fullUnit = timeUnits[unit];
    if (!fullUnit) {
      throw new Error(`Invalid time unit: ${unit}`);
    }

    // Thêm 's' nếu số lớn hơn 1
    const plural = number > 1 ? 's' : '';

    return `${number} ${fullUnit}${plural}`;
  }
}

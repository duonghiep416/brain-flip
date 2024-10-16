import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from 'src/shared/services/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { BlacklistTokenService } from 'src/blacklist_token/blacklist_token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlacklistToken]),
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      // Đăng ký JwtModule để cung cấp JwtService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_SECRET_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, TokenService, UserService, BlacklistTokenService],
  controllers: [AuthController],
})
export class AuthModule {}

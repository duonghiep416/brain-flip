import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { LogoutDto } from 'src/auth/dto/logout.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.userService.create(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  logout(@Body() logoutDto: LogoutDto, @Req() req: Request) {
    return this.authService.logout(req, logoutDto);
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('validate-token')
  validateToken(@Req() req: Request) {
    return this.authService.validateToken(req);
  }

  @Post('forgot-password')
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
    @Req() req: Request,
  ) {
    return this.authService.requestResetPassword(requestResetPasswordDto, req);
  }

  @Post('forgot-password/reset')
  resetPassword(
    @Query('reset_token') resetToken: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request,
  ) {
    return this.authService.resetPassword(resetToken, resetPasswordDto, req);
  }
}

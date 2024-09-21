import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
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

  @Post(':id/refresh-token')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Param('id') id: string,
  ) {
    return this.authService.refreshToken(refreshTokenDto, id);
  }
}

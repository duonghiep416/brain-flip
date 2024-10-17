import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Get('me')
  getDetailUserByToken(@Req() req: Request) {
    return this.userService.getDetailUserByToken(req);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.userService.getDetailUser(id);
  }
}

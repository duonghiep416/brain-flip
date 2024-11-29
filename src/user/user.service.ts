import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseErrorCodes } from 'src/config/database-error.config';
import { PasswordService } from 'src/shared/services/password.service';
import { plainToClass } from 'class-transformer';
import { omit } from 'lodash';
import { TokenService } from 'src/shared/services/token.service';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = plainToClass(User, createUserDto);
      user.password = await PasswordService.hashPassword(user.password);
      const savedUser = await this.usersRepository.save(user);
      return omit(savedUser, 'password');
    } catch (error) {
      console.error('error', error);
      if (error.code === DatabaseErrorCodes.UNIQUE_VIOLATION) {
        // Postgres unique violation error code
        const key = error.detail.match(/\((.*?)\)/)[1];
        console.error(`Conflict on key: ${key}`);
        throw new ConflictException(
          `The ${key.toUpperCase()} you provided is already in use. Please choose a different ${key.toUpperCase()}.`,
        );
      }
      throw error;
    }
  }

  async delete(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    return { message: `User successfully deleted` };
  }

  async getDetailUser(id: string) {
    try {
      const result = await this.usersRepository.findOne({
        where: {
          id,
        },
      });
      return omit(result, 'password');
    } catch (error) {
      console.error('error', error);
    }
  }

  async getDetailUserByToken(req: Request) {
    const { sub: currentUserId } = this.tokenService.getDataFromToken(req);
    try {
      const result = await this.usersRepository.findOne({
        where: {
          id: currentUserId,
        },
      });
      console.log('result', result);
      return omit(result, 'password');
    } catch (error) {
      console.error('error', error);
    }
  }
}

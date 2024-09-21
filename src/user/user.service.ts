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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
        throw new ConflictException(error.detail);
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
}
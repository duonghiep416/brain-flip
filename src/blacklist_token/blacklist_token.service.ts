import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBlacklistTokenDto } from './dto/create-blacklist_token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistTokenService {
  constructor(
    @InjectRepository(BlacklistToken)
    private readonly blacklistTokenRepository: Repository<BlacklistToken>,
  ) {}
  async create(createBlacklistTokenDto: CreateBlacklistTokenDto) {
    const blacklistToken = await this.blacklistTokenRepository.findOne({
      where: { token: createBlacklistTokenDto.token },
    });
    if (blacklistToken) {
      throw new ConflictException('Token already exists');
    }
    return await this.blacklistTokenRepository.save(createBlacklistTokenDto);
  }
}

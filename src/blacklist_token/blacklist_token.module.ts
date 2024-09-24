import { Module } from '@nestjs/common';
import { BlacklistTokenService } from './blacklist_token.service';
import { BlacklistTokenController } from './blacklist_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistToken])],
  controllers: [BlacklistTokenController],
  providers: [BlacklistTokenService],
})
export class BlacklistTokenModule {}

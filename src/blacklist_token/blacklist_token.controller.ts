import { Controller, Post, Body } from '@nestjs/common';
import { BlacklistTokenService } from './blacklist_token.service';
import { CreateBlacklistTokenDto } from './dto/create-blacklist_token.dto';

@Controller('blacklist-token')
export class BlacklistTokenController {
  constructor(private readonly blacklistTokenService: BlacklistTokenService) {}

  @Post()
  create(@Body() createBlacklistTokenDto: CreateBlacklistTokenDto) {
    return this.blacklistTokenService.create(createBlacklistTokenDto);
  }
}

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { BlacklistToken } from 'src/blacklist_token/entities/blacklist_token.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import { TokenService } from 'src/shared/services/token.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(
    @InjectRepository(BlacklistToken)
    private readonly blacklistRepository: Repository<BlacklistToken>,
    private readonly tokenService: TokenService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const token = this.tokenService.getAccessToken(req);
    const blacklistToken = await this.blacklistRepository.findOne({
      where: { token, type: TokenType.ACCESS },
    });
    const isTokenValid = this.tokenService.verifyAccessToken(token);
    if (blacklistToken || !isTokenValid) throw new UnauthorizedException();
    next();
  }
}

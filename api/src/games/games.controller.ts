import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GamesService } from './games.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('tiger/spin')
  play(@Request() req, @Body() body: { amount: number }) {
    // CORREÇÃO: Mudamos de 'playTiger' para 'spin'
    // E passamos (User ID, Wallet ID, Valor da Aposta)
    return this.gamesService.spin(req.user.userId, req.user.walletId, body.amount);
  }
}
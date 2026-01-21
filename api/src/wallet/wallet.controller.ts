import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Rota simples apenas para consultar saldo se precisar
  // (Geralmente usamos o /users/profile, mas essa fica de backup)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }
}
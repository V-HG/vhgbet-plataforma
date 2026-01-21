import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { WalletModule } from '../wallet/wallet.module'; // Importa o arquivo vizinho

@Module({
  // A LINHA MÁGICA: Importa a Carteira para dentro do Jogo
  imports: [WalletModule], 
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
